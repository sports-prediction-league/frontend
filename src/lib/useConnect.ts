import { useAppDispatch } from "../state/store";
import { setConnectedAddress } from "../state/slices/appSlice";
import {
  AVNU_API_KEY,
  CONTRACT_ADDRESS,
  parseUnits,
  TOKEN_ADDRESS,
} from "./utils";
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
          {
            contract: CONTRACT_ADDRESS,
            selector: "make_prediction",
          },
          {
            contract: CONTRACT_ADDRESS,
            selector: "claim_reward",
          },
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

  const handleConnect = async ({
    callbackData,
    approval = parseUnits("100").toString(),
  }: {
    callbackData?: string;
    approval?: string;
  }) => {
    try {
      const argentWebWallet = getArgentWallet();
      const response = await argentWebWallet.requestConnection({
        callbackData: callbackData,
        approvalRequests: [
          {
            tokenAddress: TOKEN_ADDRESS as any,
            amount: approval.toString(),
            // Your dapp contract
            spender: CONTRACT_ADDRESS as any,
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

  const approveToken = async (amount: string) => {
    try {
      const argentWebWallet = getArgentWallet();
      const response = await argentWebWallet.requestApprovals([
        {
          tokenAddress: TOKEN_ADDRESS as any,
          amount: parseUnits(amount).toString(),
          // Your dapp contract
          spender: CONTRACT_ADDRESS as any,
        },
      ]);
      console.log(response);

      return response;
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
    localStorage.removeItem("rank_and_point");
    dispatch(setConnectedAddress(null));
    const event = new Event("windowWalletClassChange");
    window.dispatchEvent(event);
  };

  return { handleConnect, handleDisconnect, getArgentWallet, approveToken };
};

export default useConnect;
