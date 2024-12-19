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
  CONTRACT_ADDRESS,
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
  const [test, setTest] = useState("");

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

          (async function () {
            const yo =
              await argentTMA.sessionAccount?.getOutsideExecutionPayload({
                calls: [
                  {
                    contractAddress: CONTRACT_ADDRESS,
                    entrypoint: "register_user",
                    calldata: [cairo.felt("id"), cairo.felt("username")],
                  },
                ],
              });

            // window.Wallet.Account!.execute([yo!])
            setTest(JSON.stringify(yo));
          })();

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
      // const contract = getWalletProviderContract();
      const random = Math.floor(10000000 + Math.random() * 90000000).toString();
      const argentTMA = getArgentTMA();
      if (!profile?.id || !profile?.username) {
        toast.error("Profile not initialized");
        return;
      }

      const outsideExecutionPayload =
        await argentTMA.sessionAccount?.getOutsideExecutionPayload({
          calls: [
            {
              contractAddress: CONTRACT_ADDRESS,
              entrypoint: "register_user",
              calldata: [
                cairo.felt(profile.id.toString().trim()),
                cairo.felt(profile.username.trim().toLowerCase()),
              ],
            },
          ],
        });
      if (!outsideExecutionPayload) {
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
              id: Number(random),
              username: username,
            },
          })
        );
        set_registering(false);
        dispatch(setShowRegisterModal(false));
        toast.success("Username set!");
      }

      // await contract!.register_user(
      //   is_mini_app && profile?.id
      //     ? cairo.felt(profile.id.toString().trim())
      //     : cairo.felt(random),
      //   cairo.felt(profile.username.trim().toLowerCase()),
      //   {
      //     // version: 3,
      //     maxFee: 10 ** 15,
      //   }
      // );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message
          ? parse_error(error.response?.data?.message)
          : error.message || "An error occurred"
      );
      set_registering(false);
    }
  };

  // const [testd, setTestd] = useState(false);

  // useEffect(() => {
  //   if (connected_address) {
  //     (async function () {
  //       await window.Wallet.Account?.execute([
  //         {
  //           contractAddress:
  //             "0x0312ae428d2bd7d3189145b5a77e890bd6934c2fae2f5ca0b9c00ea68f143a63",
  //           entrypoint: "execute_from_outside_v2",
  //           calldata: [
  //             "308399107364216179017042",
  //             "3258267720451575460428181927699975360353359431469919622971274011841998923090",
  //             "1734530373",
  //             "1734532173",
  //             "1",
  //             "2708871637889328628919633594961942651887943703197911270471008712371699076313",
  //             "788248422000618795624366131393946861382421888932606816146358898928769280003",
  //             "2",
  //             "26980",
  //             "8463219666911849829",
  //             "23",
  //             "9142636246618693420466307818862",
  //             "1742207096",
  //             "301175588207150932574619659849973936519750810921574580910507009209792844691",
  //             "2672753365883206378698679805485679183703031288173355537802237409055646475584",
  //             "514814658466192803892720164893035815131910130124773560938284951518295534107",
  //             "0",
  //             "4",
  //             "2704043122819034630116494705472635939246658013305935731385118357628015198455",
  //             "2948003945521239041628072963242093060265353022512657982255127931144915954110",
  //             "305984204278346962444520091859764854298813308165966380743859645954962374895",
  //             "2862219257745499425593749407537866707311290637117612145816912628300268306256",
  //             "0",
  //             "2737713616391275179064841841820402046452869309546474037877016076923474397620",
  //             "1020206577877772876254536804863777508907712444662128452025933372978916129178",
  //             "2349241557560757849934426741723382979282308810373686522426805399193321807785",
  //             "0",
  //             "2559290508917437267591693896947607533319957648296592750815769382542571223320",
  //             "1947022775308390580638052037477061093741138796851735432704945917593682406099",
  //             "1576079175545723834060026240930674782929693316445489001295039815336395539797",
  //             "1",
  //             "2",
  //             "3066716779780876096051617787079584002277458849863086276597434881853346356341",
  //             "188962232406527721010498065320463235005976224643820932025576116665396835416",
  //           ],
  //         },
  //       ]);
  //     })();
  //   }
  // }, [connected_address]);

  return (
    <ThemeProvider>
      {test}
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
