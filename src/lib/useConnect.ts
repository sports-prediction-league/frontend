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


  const dispatch = useAppDispatch();

  const handleConnect = async (approvals?: any[], callbackData?: string) => {
    try {
   
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
      
    } catch (error: any) {
      toast.error(error.message || "error here");
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
  
      await disconnect();
    
    window.Wallet = {
      Account: undefined,
      IsConnected: false,
    };
    dispatch(setConnectedAddress(null));
    const event = new Event("windowWalletClassChange");
    window.dispatchEvent(event);
  };

  return { handleConnect, handleDisconnect,  };
};

export default useConnect;
