// CONTEXT
import {
  addLeaderboard,
  bulkAddLeaderboard,
  bulkSetMatches,
  InitDataUnsafe,
  LeaderboardProp,
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
} from "src/state/slices/appSlice";
import { ThemeProvider } from "../context/ThemeContext";

// ROUTER
import Router from "../router/Router";
import { cairo, WalletAccount } from "starknet";
import { SessionAccountInterface } from "@argent/tma-wallet";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";
import useContractInstance from "src/lib/useContractInstance";
import {
  apiClient,
  feltToString,
  groupMatchesByDate,
  parse_error,
} from "src/lib/utils";
import toast from "react-hot-toast";
import RegisterModal from "src/common/components/modal/RegisterModal";
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: InitDataUnsafe;
        close: () => void;
      };
    };
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
  const dispatch = useAppDispatch();
  const {
    current_round,
    is_mini_app,
    profile,
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
              username: feltToString(element.user),
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
        const username = await contract!.get_user_by_address(address);
        dispatch(update_profile({ username: feltToString(username) }));
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

          // Custom data passed to the requestConnection() method is available here
          // console.log("callback data:", res.callbackData);
        })
        .catch((err: any) => {
          toast.error("failed to connect");
          console.error("Failed to connect", err);
        });
    }
  }, [is_mini_app]);

  const [registering, set_registering] = useState(false);

  const register_user = async (username: string) => {
    try {
      if (!username.trim()) return;
      set_registering(true);
      const contract = getWalletProviderContract();
      const random = Math.floor(10000000 + Math.random() * 90000000).toString();

      await contract!.register_user(
        is_mini_app && profile?.id
          ? cairo.felt(profile.id.toString().trim())
          : cairo.felt(random),
        cairo.felt(username.trim().toLowerCase()),
        {
          // version: 3,
          maxFee: 10 ** 15,
        }
      );

      dispatch(
        addLeaderboard({
          totalPoints: 0,
          user: {
            id: Number(random),
            username: username,
          },
        })
      );
      set_registering(false);
      dispatch(setShowRegisterModal(false));
      toast.success("Username set!");
    } catch (error: any) {
      toast.error(parse_error(error?.message));
      set_registering(false);
    }
  };

  return (
    <ThemeProvider>
      <RegisterModal
        t_username={profile?.username}
        loading={registering}
        onOpenChange={() => {
          dispatch(setShowRegisterModal(false));
        }}
        onSubmit={register_user}
        open={show_register_modal}
      />
      <Router />
    </ThemeProvider>
  );
}

export default App;
