import ABI from "src/assets/ABI.json";
import { AccountInterface, Contract, RpcProvider } from "starknet";
import { CONTRACT_ADDRESS, TOKEN_ADDRESS } from "./utils";
import toast from "react-hot-toast";

const useContractInstance = () => {
  const getWalletProviderContract = () => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");
      return;
    }

    const contract = new Contract(
      ABI.spl,
      CONTRACT_ADDRESS,
      window.Wallet.Account as unknown as AccountInterface
    );

    return contract;
  };

  const getWalletProviderContractERC20 = () => {
    if (!window.Wallet?.Account || !window.Wallet?.IsConnected) {
      toast.error("Wallet not connected!");
      return;
    }

    const contract = new Contract(
      ABI.erc20,
      TOKEN_ADDRESS,
      window.Wallet.Account as unknown as AccountInterface
    );

    return contract;
  };

  const getRPCProviderContract = () => {
    const RPC_URL = process.env.REACT_APP_RPC_URL;
    const provider = new RpcProvider({ nodeUrl: `${RPC_URL}` });
    const contract = new Contract(ABI.spl, CONTRACT_ADDRESS, provider);
    return contract;
  };

  return {
    getWalletProviderContract,
    getRPCProviderContract,
    getWalletProviderContractERC20,
  };
};

export default useContractInstance;
