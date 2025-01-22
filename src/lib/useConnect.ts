import { SessionAccountInterface, ArgentTMA } from "@argent/tma-wallet";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "src/state/store";
import { WalletAccount } from "starknet";
import { connect, disconnect } from "starknetkit";
import {
  ConnectCalldata,
  setConnectedAddress,
} from "src/state/slices/appSlice";
import {
  CONTRACT_ADDRESS,
  MINI_APP_URL,
  parseUnits,
  TOKEN_ADDRESS,
  TOKEN_DECIMAL,
} from "./utils";
import toast from "react-hot-toast";

const useConnect = () => {
  const getArgentTMA = () => {
    alert(CONTRACT_ADDRESS)
    const argentTMA = ArgentTMA.init({
      environment: "sepolia", // "sepolia" | "mainnet" (not supperted yet)
      appName: "SPL", // Your Telegram app name
      appTelegramUrl: MINI_APP_URL, // Your Telegram app URL
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

  const handleConnect = async (approvals?: any[], callbackData?: string) => {
    try {
      if (is_mini_app) {
        const argentTMA = getArgentTMA();

        // If not connected, trigger a connection request
        // It will open the wallet and ask the user to approve the connection
        // The wallet will redirect back to the app and the account will be available
        // from the connect() method -- see above
        await argentTMA.requestConnection({
          callbackData:"callback",
            // callbackData ?? JSON.stringify({ type: "none" } as ConnectCalldata),
          // approvalRequests: approvals,
        });
      } else {
        const { wallet } = await connect();

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
    } catch (error: any) {
      toast.error(error.message || "error here");
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
    if (is_mini_app) {
      const argentTMA = getArgentTMA();

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
