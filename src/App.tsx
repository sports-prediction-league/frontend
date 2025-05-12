// CONTEXT
import {
  addLeaderboard,
  bulkAddLeaderboard,
  bulkAddVirtualMatches,
  bulkSetVirtualMatches,
  ConnectCalldata,
  InitDataUnsafe,
  initializePredictionHistory,
  LeaderboardProp,
  MatchData,
  Prediction,
  removeUser,
  reset,
  setCalldata,
  setConnectedAddress,
  setIsRegistered,
  setLoadingState,
  setPredictions,
  updateLoadingStates,
  // setPredictions,
  setReward,
  setRounds,
  setShowRegisterModal,
  submitPrediction,
  update_profile,
  updateVirtualMatches,
  // updateMatches,
} from "./state/slices/appSlice";
import { ThemeProvider } from "./context/ThemeContext";

// ROUTER
import Router from "./router/Router";
import { cairo } from "starknet";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./state/store";
import useConnect from "./lib/useConnect";
import useContractInstance from "./lib/useContractInstance";
import {
  apiClient,
  deserializePredictions,
  feltToString,
  formatUnits,
  groupVirtualMatches,
  parse_error,
} from "./lib/utils";
import toast from "react-hot-toast";
import RegisterModal from "./common/components/modal/RegisterModal";

import SPLASH from "./assets/splash/splash.gif";
import SPLASH_DESKTOP from "./assets/splash/desktop_splash.gif";
import { useSocket } from "./lib/useSocket";
import { SessionAccountInterface } from "@argent/invisible-sdk";
import WinModal from "./common/components/modal/Win";
// import TwoTabApp from "./pages/match/view/Tab";
// import SoccerGame from "./pages/home/components/Play";
// import SoccerGame from "./pages/home/components/Play";
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: InitDataUnsafe;
        close: () => void;
      };
    };
    SIR: any;
  }
}

interface Wallet {
  IsConnected: boolean;
  Account: SessionAccountInterface | typeof undefined;
}

declare global {
  interface Window {
    Wallet: Wallet;
  }
}

function App() {
  let socket = useSocket(import.meta.env.VITE_RENDER_ENDPOINT!, {
    reconnectionDelay: 10000,
    transports: ["websocket"],
    autoConnect: false,
  });
  const [rankAndPoint, setRankAndPoint] = useState<null | {
    rank: number;
    point: number;
  }>(null);

  const [loaded, setLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const { matches, connected_address, show_register_modal, predicted_matches } =
    useAppSelector((state) => state.app);
  const { getArgentWallet } = useConnect();
  const { getWalletProviderContract, getRPCProviderContract } =
    useContractInstance();
  const [isWinModalOpen, setWinModalOpen] = useState(false);
  const fetch_matches = async () => {
    try {
      dispatch(setLoadingState(true));
      const response = await apiClient.get("/matches");
      console.log(response.data);

      if (response.data.success) {
        // const groupedLiveMatches = groupMatchesByDate(
        //   response.data.data.matches.live
        // );
        dispatch(
          setRounds([
            response.data.data.total_rounds,
            response.data.data.current_round,
          ])
        );
        if (matches.virtual.length === 0) {
          dispatch(
            bulkSetVirtualMatches(
              groupVirtualMatches(response.data.data.matches.virtual)
            )
          );
        }
      }
      dispatch(setLoadingState(false));
      setLoaded(true);
      // console.log(response.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
      dispatch(setLoadingState(false));
    }
  };

  const get_user_predictions = async (address: string) => {
    try {
      // if (current_round === 0) return;
      const contract = getWalletProviderContract();
      const matchesIDS = matches.virtual
        .map((mp) => mp.matches.map((mp) => cairo.felt(mp.details.fixture.id)))
        .flat();
      if (matchesIDS.length === 0) return;
      const predictions = await contract!.get_user_matches_predictions(
        matchesIDS,
        address
      );

      // console.log({ predictions })

      let structured: Prediction[] = [];

      for (let i = 0; i < predictions.length; i++) {
        const element = predictions[i];

        if (element.inputed) {
          structured.push({
            stake: Number(element.stake),
            odd: element.odd.Some
              ? {
                Some: {
                  tag:
                    element.odd.Some.tag.toString().length < 3
                      ? element.odd.Some.tag.toString()
                      : feltToString(element.odd.Some.tag),
                  value: Number(element.odd.Some.value),
                },
              }
              : { None: true },
            prediction_type: {
              variant: element.prediction_type.variant.Multiple
                ? {
                  Multiple: {
                    match_id: feltToString(
                      element.prediction_type.variant.Multiple.match_id
                    ),
                    pair_id: feltToString(
                      element.prediction_type.variant.Multiple.pair_id
                    ),
                    odd: feltToString(
                      element.prediction_type.variant.Multiple.odd
                    ),
                  },
                }
                : {
                  Single: {
                    match_id: feltToString(
                      element.prediction_type.variant.Single?.match_id
                    ),
                    odd: feltToString(
                      element.prediction_type.variant.Single?.odd
                    ),
                  },
                },
            },
          });
        }
      }

      dispatch(setPredictions(structured));
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    (function () {
      if (predicted_matches.length > 0) {
        if (matches.virtual.length > 0) {
          dispatch(setPredictions());
        }
      }
    })();
  }, [matches]);

  async function fetchLeaderboardAndUserReward(address: string | null) {
    try {
      const contract = address
        ? getWalletProviderContract()
        : getRPCProviderContract();
      const [leaderboard, _reward] = await Promise.all([
        contract!.get_leaderboard(cairo.uint256(1), cairo.uint256(1000)),
        address ? contract!.get_user_reward(address) : undefined,
      ]);

      if (address && _reward) {
        const formatedValue = formatUnits(_reward);

        // if (Number(formatedValue) > Number(reward)) {
        //   alert(`Win===>> ${Number(formatedValue) - Number(reward)}`);
        // }
        dispatch(setReward(formatedValue));
      }
      let structured_data: LeaderboardProp[] = [];

      for (let i = 0; i < leaderboard.length; i++) {
        const element = leaderboard[i];
        const construct = {
          user: {
            username: feltToString(element.user.username),
            address: `0x0${element.user?.address?.toString(16)}`,
            id: feltToString(element.user?.id),
          },
          totalPoints: Number(element.total_score) / 100,
        };

        structured_data.push(construct);
      }

      const sorted = structured_data.sort(
        (a, b) => b.totalPoints - a.totalPoints
      );

      if (address) {
        const userIndex = sorted.findIndex(
          (fd) =>
            parseInt(fd.user.address ?? "0x0", 16) === parseInt(address, 16)
        );
        if (userIndex !== -1) {
          const construct = sorted[userIndex];
          const localstorageRankAndPoint =
            localStorage.getItem("rank_and_point");
          if (localstorageRankAndPoint) {
            const parsed = JSON.parse(localstorageRankAndPoint);
            if (userIndex + 1 < Number(parsed.rank)) {
              setRankAndPoint({
                point: construct.totalPoints,
                rank: userIndex + 1,
              });
              setWinModalOpen(true);
            }
          } else {
            if (construct.totalPoints > 0) {
              setRankAndPoint({
                point: construct.totalPoints,
                rank: userIndex + 1,
              });
              setWinModalOpen(true);
            }
          }

          localStorage.setItem(
            "rank_and_point",
            JSON.stringify({
              rank: userIndex + 1,
              point: construct.totalPoints,
            })
          );
        }
      }
      dispatch(bulkAddLeaderboard(structured_data));
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    fetchLeaderboardAndUserReward(connected_address);
  }, [connected_address]);

  const get_user_details = async (address: string) => {
    try {
      const contract = getWalletProviderContract();
      const result = await contract!.get_user_by_address(address);
      if (Number(result.address) === 0) {
        if (!show_register_modal) {
          dispatch(setShowRegisterModal(true));
        }
      } else {
        dispatch(setIsRegistered(true));
        dispatch(
          update_profile({
            username: feltToString(result.username),
            id: feltToString(result.id),
            address: `0x0${BigInt(result.address).toString(16)}`,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (connected_address) {
      get_user_details(connected_address);
    }
  }, [connected_address]);

  useEffect(() => {
    if (connected_address) {
      get_user_predictions(connected_address);
    }
  }, [connected_address, loaded]);

  useEffect(() => {
    fetch_matches();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const handle_wallet_change = () => {
      if (!window.Wallet?.IsConnected) {
        dispatch(reset());
        return;
      }

      if (interval) clearInterval(interval);

      interval = setInterval(() => {
        const address = window.Wallet?.Account?.address;

        if (!connected_address && address) {
          dispatch(setConnectedAddress(address));
          clearInterval(interval!);
          interval = null;
        }

        if (connected_address || !window.Wallet) {
          clearInterval(interval!);
          interval = null;
        }
      }, 500);
    };

    handle_wallet_change();

    window.addEventListener("windowWalletClassChange", handle_wallet_change);

    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener(
        "windowWalletClassChange",
        handle_wallet_change
      );
    };
  }, [connected_address, dispatch]);

  useEffect(() => {
    const handle_update = async () => {
      try {
        if (!connected_address) {
          return;
        }
        const contract = getWalletProviderContract();
        const predictions = await contract!.get_user_predictions(
          connected_address
        );

        dispatch(
          initializePredictionHistory(deserializePredictions(predictions))
        );
      } catch (error) {
        console.error(error);
      }
    };

    const listener = () => {
      handle_update(); // call the async function inside a sync wrapper
    };

    window.addEventListener("PREDICTION_MADE", listener);
    return () => {
      window.removeEventListener("PREDICTION_MADE", listener);
    };
  }, [connected_address]);

  useEffect(() => {
    window.addEventListener("MAKE_OUTSIDE_EXECUTION_CALL", (event: Event) => {
      if (!socket.connected) {
        return;
      }
      const customEvent = event as CustomEvent;
      if (customEvent.detail.payload && customEvent.detail.type) {
        // if (loading_statespredicting) return;
        socket.emit("make-outside-execution-call", customEvent.detail);
      }
    });
    return () => {
      window.removeEventListener("MAKE_OUTSIDE_EXECUTION_CALL", () => { });
    };
  }, []);

  const [registering, set_registering] = useState(false);
  const register_user = async (user_name?: string) => {
    try {
      if (registering) return;
      set_registering(true);
      const contract = getWalletProviderContract();

      if (!user_name || user_name.trim().length < 1) {
        toast.error("Input username");
        set_registering(false);
        return;
      }
      // if (!profile?.id || !profile?.username) {
      //   toast.error("Profile not initialized");
      //   set_registering(false);
      //   return;
      // }

      if (
        !window?.Wallet?.IsConnected ||
        !window?.Wallet?.Account ||
        !connected_address
      ) {
        toast.error("Wallet not connected");
        set_registering(false);
        return;
      }

      if (!contract) {
        toast.error("Contract not initialized");
        set_registering(false);
        return;
      }

      const id = Math.random().toString(36).substring(2, 12);
      const call = contract?.populate("register_user", [
        {
          id: cairo.felt(id),
          username: cairo.felt(user_name.trim().toLowerCase()),
          address: connected_address,
        },
      ]);

      if (!call?.calldata) {
        toast.error("Invalid call");
        set_registering(false);
        return;
      }

      const account = window.Wallet.Account;

      // const tx = await account.execute(call);
      // const receipt = await account.waitForTransaction(tx.transaction_hash);
      // console.log(receipt);

      // const oi = await account.getDeploymentPayload();
      // setRes(JSON.stringify(oi));

      const outsideExecutionPayload = await account.getOutsideExecutionPayload({
        calls: [call],
      });

      // console.log(outsideExecutionPayload)

      // setPl(JSON.stringify(outsideExecutionPayload));
      if (!outsideExecutionPayload) {
        set_registering(false);
        toast.error("error processing outside payload");
        return;
      }

      const user_construct = {
        totalPoints: 0,
        user: {
          id: id,
          username: user_name.trim().toLowerCase(),
          address: connected_address,
        },
      };

      dispatch(addLeaderboard(user_construct))

      const event = new CustomEvent("MAKE_OUTSIDE_EXECUTION_CALL", {
        detail: {
          type: "REGISTRATION",
          payload: outsideExecutionPayload,
        },
      });
      window.dispatchEvent(event);

      // const response = await apiClient.post(
      //   "/execute",
      //   outsideExecutionPayload
      // );

      // if (response.data.success) {
      //   dispatch(
      // addLeaderboard({
      //   totalPoints: 0,
      //   user: {
      //     id: id,
      //     username: user_name.trim().toLowerCase(),
      //     address: connected_address,
      //   },
      // })
      //   );
      //   dispatch(setShowRegisterModal(false));
      //   dispatch(setIsRegistered(true));
      //   toast.success("Username set!");
      // } else {
      //   toast.error(
      //     response.data?.message ?? "OOOPPPSSS!! Something went wrong"
      //   );
      // }

      // set_registering(false);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message
          ? parse_error(error.response?.data?.message)
          : error.message || "An error occurred"
      );
      set_registering(false);
    }
  };

  // useEffect(() => {
  //   if (connected_address) {
  //     (async function () {
  //       try {
  //         const contract = getWalletProviderContract();

  //         // const call = contract!.populate("make_bulk_prediction", [
  //         //   [
  //         //     {
  //         //       inputed: true,
  //         //       match_id: cairo.felt("123"),
  //         //       home: cairo.uint256(4),
  //         //       away: cairo.uint256(3),
  //         //       stake: cairo.uint256(1),
  //         //     },
  //         //     {
  //         //       inputed: true,
  //         //       match_id: cairo.felt("123"),
  //         //       home: cairo.uint256(4),
  //         //       away: cairo.uint256(3),
  //         //       stake: cairo.uint256(1),
  //         //     },
  //         //   ],
  //         // ]);

  //         const call = contract!.populate("register_user", [
  //           {
  //             id: cairo.felt(profile!.id!.toString().trim()),
  //             username: cairo.felt(profile!.username!.trim().toLowerCase()),
  //             address: connected_address,
  //           },
  //         ]);

  //         setResp(JSON.stringify(CallData.compile([CONTRACT_ADDRESS])));

  //         const account = window.Wallet.Account as SessionAccountInterface;

  //         const outsideExecutionPayload =
  //           await account.getOutsideExecutionPayload({
  //             calls: [call],
  //           });

  //         // setRes(JSON.stringify(outsideExecutionPayload));
  //       } catch (error: any) {
  //         toast.error(error.message);
  //       }

  //       // console.log({ call });
  //     })();
  //   }
  // }, [connected_address]);
  // const [res, set_res] = useState("");

  const [splash_active, set_splash_active] = useState(true);
  // const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => {
      // setIsPageLoaded(true); // Page has fully loaded
      // Start the 20-second timer
      const timer = setTimeout(() => {
        set_splash_active(false);
      }, 6000);

      // Cleanup timer
      return () => clearTimeout(timer);
    };

    handlePageLoad();

    // window.addEventListener("load", handlePageLoad);

    // return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  const StartListeners = (address: string | null) => {
    socket.on("update-matches", (updated_matches: MatchData[]) => {
      console.log({ updated_matches });
      // dispatch(updateMatches(updated_matches));
    });

    socket.on(
      "new-matches",
      async (event: { newMatches: MatchData[]; fetchLeaderboard: boolean }) => {
        console.log({ event });

        if (event.newMatches.length > 0) {
          dispatch(
            bulkAddVirtualMatches(groupVirtualMatches(event.newMatches))
          );
        }
        if (event.fetchLeaderboard) {
          await fetchLeaderboardAndUserReward(address);
        }
      }
    );

    socket.on("match-events-response", (response: MatchData[]) => {
      console.log({ match_event_response: response }, "==========>>>>>>>");
      dispatch(updateVirtualMatches(response));
    });

    socket.on(
      "execution-response",
      (response: { type: "REGISTRATION" | "PREDICTION" | "WITHDRAWAL" | "MINT"; tx: any }) => {
        console.log({ response }, "execution response ==========>>>>>>>");


        if (response.type === "PREDICTION") {
          if (response.tx.success) {
            const event = new Event("PREDICTION_MADE");
            window.dispatchEvent(event);
            toast.success("Prediction Successful");
            dispatch(submitPrediction());
          } else {
            toast.error(response.tx.message);
          }

          dispatch(updateLoadingStates({ predicting: false }));
        } else if (response.type === "REGISTRATION") {
          if (response.tx.success) {

            dispatch(setShowRegisterModal(false));
            dispatch(setIsRegistered(true));
            toast.success("Username set!");
          } else {
            dispatch(removeUser(address!))
            toast.error(response.tx.message);
          }

          set_registering(false);
        } else if (response.type === "WITHDRAWAL") {
          if (response.tx.success) {


            dispatch(setReward("0"));
            toast.success("Reward claimed!");
          } else {

            toast.error(response.tx.message);
          }

          dispatch(updateLoadingStates({ claimingReward: false }))
        } else if (response.type === "MINT") {
          if (response.tx.success) {
            toast.success("Tokens minted!");
          } else {

            toast.error(response.tx.message);
          }
          dispatch(updateLoadingStates({ minting: false }))
        }
      }
    );
  };




  useEffect(() => {
    window.addEventListener("matchStatusChange", (event: Event) => {
      const customEvent = event as CustomEvent;
      if (!socket.connected) {
        return;
      }
      socket.emit("match-events-request", customEvent.detail);
      // console.log("Match status changed:", customEvent.detail);
    });

    return () => window.removeEventListener("matchStatusChange", () => { });
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (connected_address) {
      StartListeners(connected_address);
    }
  }, [connected_address]);

  useEffect(() => {
    const argentWebWallet = getArgentWallet();
    argentWebWallet
      .connect()
      .then((res) => {
        if (!res) {
          console.log("Not connected");
          localStorage.removeItem("rank_and_point");
          return;
        }

        console.log("Connected to Argent Web Wallet", res);
        const { account, callbackData, approvalTransactionHash } = res;

        if (account.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
          localStorage.removeItem("rank_and_point");
          return;
        }

        window.Wallet = {
          Account: res.account,
          IsConnected: true,
        };

        dispatch(
          setCalldata(
            JSON.parse(
              res.callbackData ??
              JSON.stringify({ type: "none" } as ConnectCalldata)
            )
          )
        );

        const event = new Event("windowWalletClassChange");
        window.dispatchEvent(event);
        console.log(res);
        console.log("Callback data", callbackData); // -- custom_callback_string
        console.log("Approval transaction hash", approvalTransactionHash); // -- custom_callback_string
      })
      .catch((err) => {
        console.error("Failed to connect to Argent Web Wallet", err);
      });
  }, []);

  // if (!isPageLoaded) {
  //   return null; // Wait until the page has fully loaded
  // }

  // if (matches.virtual.length) {
  //   return <SoccerGame gameEvent={matches.virtual[0]?.matches[0]?.details?.events ?? []} />
  // }

  // return <TwoTabApp />

  return (
    <ThemeProvider>
      <WinModal
        rank={rankAndPoint?.rank?.toString() ?? ""}
        shareText={`🏆 BOOM! Just hit Rank #${rankAndPoint?.rank} on @splxgg! My football predictions are 🔥. Think you can do better? Game on! 👉 ${window.location.origin} #Play_Predict_Win #PredictionKing #SPL`}
        isOpen={isWinModalOpen && rankAndPoint !== null}
        onClose={() => {
          setWinModalOpen(false);
          setRankAndPoint(null);
        }}
      />
      {splash_active ? null : (
        <RegisterModal
          loading={registering}
          onOpenChange={() => {
            dispatch(setShowRegisterModal(false));
          }}
          onSubmit={register_user}
          open={show_register_modal}
        />
      )}
      {splash_active ? (
        <div className="w-full h-full">
          <img
            src={SPLASH}
            className="md:hidden block w-screen h-screen"
            alt=""
          />
          <img
            src={SPLASH_DESKTOP}
            className="md:block hidden w-screen h-screen"
            alt=""
          />
        </div>
      ) : (
        <Router />
      )}
    </ThemeProvider>
  );
}

export default App;
