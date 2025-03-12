// CONTEXT
import {
  addLeaderboard,
  bulkAddLeaderboard,
  bulkAddVirtualMatches,
  bulkSetVirtualMatches,
  ConnectCalldata,
  InitDataUnsafe,
  LeaderboardProp,
  MatchData,
  Prediction,
  setCalldata,
  setConnectedAddress,
  setIsRegistered,
  setLoaded,
  setLoadingState,
  // setPredictions,
  setReward,
  setRounds,
  setShowRegisterModal,
  update_profile,
  updateLeaderboardImages,
  updateVirtualMatches,
  // updateMatches,
} from "src/state/slices/appSlice";
import { ThemeProvider } from "../context/ThemeContext";

// ROUTER
import Router from "../router/Router";
import { cairo, RpcProvider, WalletAccount } from "starknet";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";
import useContractInstance from "src/lib/useContractInstance";
import {
  apiClient,
  CONTRACT_ADDRESS,
  feltToString,
  formatUnits,
  groupMatchesByDate,
  groupVirtualMatches,
  parse_error,
  TOKEN_DECIMAL,
} from "src/lib/utils";
import toast from "react-hot-toast";
import RegisterModal from "src/common/components/modal/RegisterModal";

import SPLASH from "../assets/splash/splash.gif";
import SPLASH_DESKTOP from "../assets/splash/desktop_splash.gif";
import { useSocket } from "src/lib/useSocket";
import { TwitterIcon, TwitterShareButton, XIcon } from "react-share";
import FootballField from "src/pages/home/components/Play";
import { SessionAccountInterface } from "@argent/invisible-sdk";
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
  let socket = useSocket(process.env.REACT_APP_RENDER_ENDPOINT!, {
    reconnectionDelay: 10000,
    transports: ["websocket"],
    autoConnect: false,
  });
  const dispatch = useAppDispatch();
  const {
    current_round,
    profile,
    matches,
    connected_address,
    show_register_modal,
  } = useAppSelector((state) => state.app);
  const { getArgentWallet } = useConnect();
  const { getWalletProviderContract, getRPCProviderContract } =
    useContractInstance();
  const fetch_matches = async () => {
    try {
      dispatch(setLoadingState(true));
      const response = await apiClient.get("/matches");
      console.log(response.data)

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
        dispatch(bulkSetVirtualMatches(groupVirtualMatches(response.data.data.matches.virtual)));
      }
      dispatch(setLoadingState(false));

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
      if (current_round === 0) return;
      const contract = getWalletProviderContract();
      const predictions = await contract!.get_user_matches_predictions(
        matches.virtual.map(mp => mp.matches.map(mp => cairo.felt(mp.details.fixture.id))).flat(),
        address
      );

      console.log({ predictions })

      let structured: Prediction[] = [];

      for (let i = 0; i < predictions.length; i++) {
        const element = predictions[i];

        if (element.inputed) {
          structured.push({
            away: Number(element.away),
            home: Number(element.home),
            inputed: element.inputed,
            match_id: `${element.match_id}`,
            stake: Number(element.stake).toString(),
          });
        }
      }

      // dispatch(setPredictions(structured));
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const contract = connected_address
          ? getWalletProviderContract()
          : getRPCProviderContract();
        const tx = await contract!.get_leaderboard(
          cairo.uint256(0),
          cairo.uint256(1000)
        );

        let structured_data: LeaderboardProp[] = [];

        for (let i = 0; i < tx.length; i++) {
          const element = tx[i];
          structured_data.push({
            user: {
              username: feltToString(element.user.username),
              address: `0x0${element.user?.address?.toString(16)}`,
              id: Number(element.user?.id),
            },
            totalPoints: Number(element.total_score),
          });
        }
        dispatch(bulkAddLeaderboard(structured_data));

        // const response = await apiClient.get("/leaderboard_images");

        // if (response.data.success) {
        //   dispatch(updateLeaderboardImages(response.data.data));
        // }
      } catch (error) {
        console.log({ error });
      }
    })();
  }, []);

  const check_if_registered = async (address: string) => {
    try {
      const contract = getWalletProviderContract();
      const result = await contract!.is_address_registered(address);
      if (!result) {
        if (!show_register_modal) {
          dispatch(setShowRegisterModal(true));
        }
      } else {
        dispatch(setIsRegistered(true));
        // if (!is_mini_app) {
        //   const user = await contract!.get_user_by_address(address);
        //   dispatch(
        //     update_profile({
        //       username: feltToString(user.username),
        //       address: `0x0${user.address.toString(16)}`,
        //     })
        //   );
        // }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (connected_address) {
      check_if_registered(connected_address);
    }
  }, [connected_address]);

  useEffect(() => {
    if (connected_address) {
      if (current_round !== 0) {
        get_user_predictions(connected_address);
      }
    }
  }, [connected_address, current_round]);

  useEffect(() => {
    fetch_matches();
  }, []);

  useEffect(() => {
    let interval: any;
    const handle_wallet_change = () => {
      if (!window.Wallet?.IsConnected) {
        dispatch(setConnectedAddress(null));
        return;
      }
      interval = setInterval(() => {
        if (connected_address) {
          clearInterval(interval);
        }
        if (window.Wallet) {
          if ((window.Wallet.Account as any)?.address) {
            if (!connected_address) {
              dispatch(
                setConnectedAddress(
                  (window.Wallet?.Account as any)?.address ?? null
                )
              );
            }

            clearInterval(interval);
          }
        } else {
          clearInterval(interval);
        }
      }, 500);
    };

    handle_wallet_change();

    window.addEventListener("windowWalletClassChange", handle_wallet_change);
    return () => {
      clearInterval(interval);
      window.removeEventListener(
        "windowWalletClassChange",
        handle_wallet_change
      );
    };
  }, []);








  const [registering, set_registering] = useState(false);
  const register_user = async (user_name?: string) => {
    try {
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

      const tx = await account.execute(call);
      const receipt = await account.waitForTransaction(tx.transaction_hash);
      console.log(receipt);


      // const oi = await account.getDeploymentPayload();
      // setRes(JSON.stringify(oi));

      // const outsideExecutionPayload = await account.getOutsideExecutionPayload({
      //   calls: [call],
      // });


      // console.log(outsideExecutionPayload)

      // setPl(JSON.stringify(outsideExecutionPayload));
      // if (!outsideExecutionPayload) {
      //   set_registering(false);
      //   toast.error("error processing outside payload");
      //   return;
      // }

      // const response = await apiClient.post(
      //   "/execute",
      //   outsideExecutionPayload
      // );

      // if (response.data.success) {
      dispatch(
        addLeaderboard({
          totalPoints: 0,
          user: {
            id: Number(id),
            username: user_name.trim().toLowerCase(),
            address: connected_address,
          },
        })
      );
      dispatch(setShowRegisterModal(false));
      dispatch(setIsRegistered(true));
      toast.success("Username set!");
      // } else {
      //   toast.error(
      //     response.data?.message ?? "OOOPPPSSS!! Something went wrong"
      //   );
      // }

      set_registering(false);
    } catch (error: any) {
      console.log(error)
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handlePageLoad = () => {
      setIsPageLoaded(true); // Page has fully loaded
      // Start the 20-second timer
      const timer = setTimeout(() => {
        set_splash_active(false);
      }, 7000);

      // Cleanup timer
      return () => clearTimeout(timer);
    };

    window.addEventListener("load", handlePageLoad);

    return () => window.removeEventListener("load", handlePageLoad);
  }, []);

  const StartListeners = () => {
    socket.on("update-matches", (updated_matches: MatchData[]) => {
      console.log({ updated_matches });
      // dispatch(updateMatches(updated_matches));
    });


    socket.on("new-matches", (new_matches: MatchData[]) => {
      console.log({ new_matches });

      dispatch(bulkAddVirtualMatches(groupVirtualMatches(new_matches)));
    });

    socket.on("match-events-response", (response: MatchData[]) => {
      console.log({ match_event_response: response }, "==========>>>>>>>")
      dispatch(updateVirtualMatches(response))
    })
  };


  useEffect(() => {
    window.addEventListener("matchStatusChange", (event: Event) => {
      const customEvent = event as CustomEvent;
      socket.emit("match-events-request", customEvent.detail);
      // console.log("Match status changed:", customEvent.detail);
    });

    return () => window.removeEventListener("matchStatusChange", () => { });
  }, [])


  useEffect(() => {
    socket.connect();
    StartListeners();
  }, []);

  useEffect(() => {

    const argentWebWallet = getArgentWallet();
    argentWebWallet
      .connect()
      .then((res) => {

        if (!res) {
          console.log("Not connected");
          return;
        }

        console.log("Connected to Argent Web Wallet", res);
        const { account, callbackData, approvalTransactionHash } = res;

        if (account.getSessionStatus() !== "VALID") {
          console.log("Session is not valid");
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
        console.log(res)
        console.log("Callback data", callbackData); // -- custom_callback_string
        console.log("Approval transaction hash", approvalTransactionHash); // -- custom_callback_string
      })
      .catch((err) => {
        console.error("Failed to connect to Argent Web Wallet", err);
      });
  }, []);





  if (!isPageLoaded) {
    return null; // Wait until the page has fully loaded
  }

  // return <FootballField />

  return (
    <ThemeProvider>
      {splash_active ? null : (
        <RegisterModal
          t_username={profile?.username}
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
