import { SessionAccountInterface, ArgentTMA } from "@argent/tma-wallet";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/state/store";
import { WalletAccount } from "starknet";
import { connect, disconnect } from "starknetkit";
import { setConnectedAddress } from "src/state/slices/appSlice";
import { CONTRACT_ADDRESS } from "./utils";

const useConnect = () => {
  const getArgentTMA = () => {
    const argentTMA = ArgentTMA.init({
      environment: "sepolia", // "sepolia" | "mainnet" (not supperted yet)
      appName: "SPL", // Your Telegram app name
      appTelegramUrl: "https://t.me/SPLBot/SPL", // Your Telegram app URL
      sessionParams: {
        allowedMethods: [
          // List of contracts/methods allowed to be called by the session key
          {
            contract: CONTRACT_ADDRESS,
            selector: "register_user",
          },
          {
            contract: CONTRACT_ADDRESS,
            selector: "make_bulk_prediction",
          },
          {
            contract: CONTRACT_ADDRESS,
            selector: "make_prediction",
          },
        ],
        validityDays: 90, // session validity (in days) - default: 90
      },
    });

    return argentTMA;
  };

  const is_mini_app = useAppSelector((state) => state.app.is_mini_app);
  const dispatch = useAppDispatch();
  const argentTMA = getArgentTMA();

  useEffect(() => {
    // Call connect() as soon as the app is loaded
    if (is_mini_app) {
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
            (
              window.Wallet?.Account as SessionAccountInterface | undefined
            )?.getSessionStatus() !== "VALID"
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

          const event = new Event("windowWalletClassChange");
          window.dispatchEvent(event);

          // Custom data passed to the requestConnection() method is available here
          console.log("callback data:", res.callbackData);
        })
        .catch((err) => {
          console.error("Failed to connect", err);
        });
    }
  }, []);

  const handleConnect = async () => {
    try {
      if (is_mini_app) {
        // If not connected, trigger a connection request
        // It will open the wallet and ask the user to approve the connection
        // The wallet will redirect back to the app and the account will be available
        // from the connect() method -- see above
        await argentTMA.requestConnection("custom_callback_data");
      } else {
        const { wallet } = await connect({});

        if (wallet && wallet.isConnected) {
          const myFrontendProviderUrl =
            "https://free-rpc.nethermind.io/sepolia-juno/v0_7";

          const myWalletAccount = new WalletAccount(
            { nodeUrl: myFrontendProviderUrl },
            wallet as any
          );
          window.Wallet = {
            Account: myWalletAccount as any,
            IsConnected: true,
          };
          // Dispatch a custom event to notify about the change
          const event = new Event("windowWalletClassChange");
          window.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
    if (is_mini_app) {
      await argentTMA.clearSession();
    } else {
      await disconnect();
    }
    window.Wallet = {
      Account: undefined,
      IsConnected: false,
    };
    dispatch(setConnectedAddress(null));
    const event = new Event("windowWalletClassChange");
    window.dispatchEvent(event);
  };

  return { handleConnect, handleDisconnect, getArgentTMA };
};

export default useConnect;
