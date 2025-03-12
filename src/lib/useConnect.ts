import { useAppDispatch, useAppSelector } from "src/state/store";
import { WalletAccount } from "starknet";
import {
  ConnectCalldata,
  setConnectedAddress,
} from "src/state/slices/appSlice";
import {
  AVNU_API_KEY,
  CONTRACT_ADDRESS,
  MINI_APP_URL,
  parseUnits,
  TOKEN_ADDRESS,
  TOKEN_DECIMAL,
} from "./utils";
import toast from "react-hot-toast";
import { ArgentWebWallet } from "@argent/invisible-sdk";

const useConnect = () => {
  const getArgentWallet = () => {
    const argentWebWallet = ArgentWebWallet.init({
      appName: "SPL",
      environment: "sepolia",
      sessionParams: {
        allowedMethods: [
          {
            contract: CONTRACT_ADDRESS,
            selector: "register_user",
          },
          {
            contract: CONTRACT_ADDRESS,
            selector: "make_bulk_prediction",
          },
          // {
          //   contract: CONTRACT_ADDRESS,
          //   selector: "make_prediction",
          // },
        ],

        validityDays: 30,
      },

      paymasterParams: {
        apiKey: AVNU_API_KEY, // avnu paymasters API Key
      },
    });

    return argentWebWallet;
  };

  const dispatch = useAppDispatch();

  const handleConnect = async (callbackData?: string) => {
    try {
      const argentWebWallet = getArgentWallet();

      const response = await argentWebWallet.requestConnection({
        callbackData: callbackData,
        approvalRequests: [
          {
            tokenAddress: TOKEN_ADDRESS,
            amount: BigInt("100000000000000000000").toString(),
            // Your dapp contract
            spender: CONTRACT_ADDRESS,
          },
        ],
      });
      console.log(response);

      if (response) {
        window.Wallet = {
          Account: response.account,
          IsConnected: true,
        };
        // Dispatch a custom event to notify about the change
        const event = new Event("windowWalletClassChange");
        window.dispatchEvent(event);
        return response.callbackData;
      }
    } catch (error: any) {
      // toast.error(error.message || "error here");
      // console.log(error);
      throw error;
    }
  };

  const handleDisconnect = async () => {
    const argentWebWallet = getArgentWallet();
    await argentWebWallet.clearSession();

    window.Wallet = {
      Account: undefined,
      IsConnected: false,
    };
    dispatch(setConnectedAddress(null));
    const event = new Event("windowWalletClassChange");
    window.dispatchEvent(event);
  };

  return { handleConnect, handleDisconnect, getArgentWallet };
};

export default useConnect;
