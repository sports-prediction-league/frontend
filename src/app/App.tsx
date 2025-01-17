// CONTEXT
import {
  addLeaderboard,
  bulkAddLeaderboard,
  bulkSetMatches,
  InitDataUnsafe,
  LeaderboardProp,
  MatchData,
  Prediction,
  setConnectedAddress,
  setIsMiniApp,
  setIsRegistered,
  setLoaded,
  setLoadingState,
  setPredictions,
  setRounds,
  setShowRegisterModal,
  update_profile,
  updateLeaderboardImages,
  updateMatches,
} from "src/state/slices/appSlice";
import { ThemeProvider } from "../context/ThemeContext";

// ROUTER
import Router from "../router/Router";
import { cairo, CallData, WalletAccount } from "starknet";
import { SessionAccountInterface } from "@argent/tma-wallet";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";
import useContractInstance from "src/lib/useContractInstance";
import {
  apiClient,
  CONTRACT_ADDRESS,
  feltToString,
  groupMatchesByDate,
  parse_error,
} from "src/lib/utils";
import toast from "react-hot-toast";
import RegisterModal from "src/common/components/modal/RegisterModal";

import SPLASH from "../assets/splash/splash.gif";
import SPLASH_DESKTOP from "../assets/splash/desktop_splash.gif";
import { useSocket } from "src/lib/useSocket";
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
  Account: SessionAccountInterface | WalletAccount | typeof undefined;
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
    is_mini_app,
    profile,
    leaderboard,
    connected_address,
    show_register_modal,
  } = useAppSelector((state) => state.app);
  const { getArgentTMA } = useConnect();
  const { getWalletProviderContract, getRPCProviderContract } =
    useContractInstance();
  const fetch_matches = async () => {
    try {
      dispatch(setLoadingState(true));
      const response = await apiClient.get("/matches");

      if (response.data.success) {
        const groupedMatches = groupMatchesByDate(
          response.data.data.matches.rows
        );
        dispatch(
          setRounds([
            response.data.data.total_rounds,
            response.data.data.current_round,
          ])
        );
        dispatch(bulkSetMatches(groupedMatches));
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
      const predictions = await contract!.get_user_predictions(
        cairo.uint256(current_round),
        address
      );

      let structured: Prediction[] = [];

      for (let i = 0; i < predictions.length; i++) {
        const element = predictions[i];

        if (element.inputed) {
          structured.push({
            away: Number(element.away),
            home: Number(element.home),
            inputed: element.inputed,
            match_id: `${element.match_id}`,
            stake: element.stake,
          });
        }
      }

      dispatch(setPredictions(structured));
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
              address: `0x${element.user?.address?.toString(16)}`,
            },
            totalPoints: Number(element.total_score),
          });
        }
        dispatch(bulkAddLeaderboard(structured_data));

        const response = await apiClient.get("/leaderboard_images");

        if (response.data.success) {
          dispatch(updateLeaderboardImages(response.data.data));
        }
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
        if (!is_mini_app) {
          const user = await contract!.get_user_by_address(address);
          dispatch(
            update_profile({
              username: feltToString(user.username),
              address: `0x${user.address.toString(16)}`,
            })
          );
        }
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

  useEffect(() => {
    const fetchProfilePhoto = async (userId: string) => {
      try {
        const response = await apiClient.get(`/profile_pic`, {
          params: { userId },
          responseType: "blob",
        });

        const photoUrl = URL.createObjectURL(new Blob([response.data]));
        dispatch(update_profile({ profile_picture: photoUrl }));
      } catch (error) {}
    };

    const telegram = window.Telegram;

    if (telegram && telegram.WebApp && telegram.WebApp.initDataUnsafe) {
      const initDataUnsafe = telegram.WebApp.initDataUnsafe;

      if (initDataUnsafe.user) {
        dispatch(setIsMiniApp(true));
        dispatch(update_profile(initDataUnsafe.user));
        if (initDataUnsafe?.user?.id) {
          fetchProfilePhoto(initDataUnsafe.user.id.toString());
        }
      } else {
        telegram?.WebApp?.close();
      }
    } else {
      telegram?.WebApp?.close();
    }
  }, []);

  useEffect(() => {
    // Call connect() as soon as the app is loaded
    if (is_mini_app) {
      const argentTMA = getArgentTMA();

      argentTMA
        .connect()
        .then((res) => {
          if (!res) {
            // Not connected
            window.Wallet = {
              Account: undefined,
              IsConnected: false,
            };

            const event = new Event("windowWalletClassChange");
            window.dispatchEvent(event);

            return;
          }

          if (
            (res.account as SessionAccountInterface).getSessionStatus() !==
            "VALID"
          ) {
            // Session has expired or scope (allowed methods) has changed
            // A new connection request should be triggered
            // The account object is still available to get access to user's address
            // but transactions can't be executed
            window.Wallet = {
              Account: res.account,
              IsConnected: false,
            };

            const event = new Event("windowWalletClassChange");
            window.dispatchEvent(event);

            return;
          }

          // Connected
          // The session account is returned and can be used to submit transactions
          window.Wallet = {
            Account: res.account,
            IsConnected: true,
          };

          toast.success("connected");

          const event = new Event("windowWalletClassChange");
          window.dispatchEvent(event);
        })
        .catch((err: any) => {
          toast.error("failed to connect");
          console.error("Failed to connect", err);
        });
    }
  }, [is_mini_app]);

  const [registering, set_registering] = useState(false);
  const register_user = async () => {
    try {
      set_registering(true);
      const contract = getWalletProviderContract();

      if (!profile?.id || !profile?.username) {
        toast.error("Profile not initialized");
        set_registering(false);
        return;
      }

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

      const call = contract?.populate("register_user", [
        {
          id: cairo.felt(profile.id.toString().trim()),
          username: cairo.felt(profile.username.trim().toLowerCase()),
          address: connected_address,
        },
      ]);

      if (!call?.calldata) {
        toast.error("Invalid call");
        set_registering(false);
        return;
      }

      const account = window.Wallet.Account as SessionAccountInterface;
      // const oi = await account.getDeploymentPayload();
      // setRes(JSON.stringify(oi));

      const outsideExecutionPayload = await account.getOutsideExecutionPayload({
        calls: [call],
      });

      // setPl(JSON.stringify(outsideExecutionPayload));
      if (!outsideExecutionPayload) {
        set_registering(false);
        toast.error("error processing outside payload");
        return;
      }

      const response = await apiClient.post(
        "/execute",
        outsideExecutionPayload
      );

      if (response.data.success) {
        dispatch(
          addLeaderboard({
            totalPoints: 0,
            user: {
              id: Number(profile.id),
              username: profile.username,
              address: connected_address,
            },
          })
        );
        dispatch(setShowRegisterModal(false));
        dispatch(setIsRegistered(true));
        toast.success("Username set!");
      } else {
        toast.error(
          response.data?.message ?? "OOOPPPSSS!! Something went wrong"
        );
      }

      set_registering(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? parse_error(error.response?.data?.message)
          : error.message || "An error occurred"
      );
      set_registering(false);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        if (is_mini_app) {
          if (window?.Wallet?.Account) {
            if (!profile?.id) return;
            const get_account_deployed_status =
              localStorage.getItem("accountDeployed");
            if (!get_account_deployed_status) {
              const account = window.Wallet.Account as SessionAccountInterface;
              const is_account_deployed = await account.isDeployed();
              if (!is_account_deployed) {
                const account_payload = await account.getDeploymentPayload();
                const response = await apiClient.post("/deploy-account", {
                  account_payload,
                  user_id: profile.id,
                });

                if (response.data.success) {
                  localStorage.setItem("accountDeployed", "true");
                }
              }
            }
          }
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message
            ? parse_error(error.response?.data?.message)
            : error.message || "An error occurred"
        );
      }
    })();
  }, [connected_address]);

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

  useEffect(() => {
    if (profile && leaderboard.length) {
      const find_index = leaderboard.findIndex(
        (fd) =>
          fd.user?.address?.toLowerCase() === profile?.address?.toLowerCase() ||
          fd.user.id === profile?.id
      );
      if (find_index !== -1) {
        dispatch(
          update_profile({
            point: {
              point: leaderboard[find_index].totalPoints,
              rank: find_index + 1,
            },
          })
        );
      }
    }
  }, [profile, leaderboard]);

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
      dispatch(updateMatches(updated_matches));
    });
  };

  useEffect(() => {
    socket.connect();
    StartListeners();
  }, []);

  if (!isPageLoaded) {
    return null; // Wait until the page has fully loaded
  }

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
      {/* <Router /> */}
    </ThemeProvider>
  );
}

export default App;
