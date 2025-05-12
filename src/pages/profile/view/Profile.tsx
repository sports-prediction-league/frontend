// components
import Title from "../../../common/components/tittle/Title";
import { useState, useEffect } from "react";

// assets
import STAR_ICON from "../../../assets/profile/star_icon.svg";
import RANK_ICON from "../../../assets/profile/rank_icon.svg";

import Button from "../../../common/components/button/Button";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import useConnect from "../../../lib/useConnect";
import { Clipboard, Share2 } from "lucide-react";
import { generateAvatarFromAddress, parse_error } from "../../../lib/utils";
import toast from "react-hot-toast";
import { useTheme } from "../../../context/ThemeContext";
import ShareOptions from "../../../common/components/modal/ShareOptions";
import useEscapeKey from "../../../lib/useEscapeKey";
import { updateLoadingStates } from "../../../state/slices/appSlice";
import useContractInstance from "../../../lib/useContractInstance";

const Profile = () => {
  const [_, setProgress] = useState(10);
  const { handleDisconnect, handleConnect } = useConnect();
  const { profile, connected_address, reward, leaderboard, loading_states } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };
  const { getWalletProviderContract } = useContractInstance()

  const [rankAndPoint, setRankAndPoint] = useState<null | { rank: number, point: number }>(null);

  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    updateProgress(50);
  }, []);


  useEffect(() => {
    (function () {
      if (!connected_address) return;
      const user = leaderboard.find(fd => parseInt(fd.user.address!, 16) === parseInt(connected_address ?? "0x0", 16))
      if (!user) return;
      const index = leaderboard.findIndex(fd => parseInt(fd.user.address!, 16) === parseInt(connected_address ?? "0x0", 16));
      setRankAndPoint({ point: user.totalPoints, rank: index + 1 })
    }())
  }, [leaderboard])

  const { isDark } = useTheme();

  useEscapeKey(() => {
    if (showShareOptions) {
      setShowShareOptions(false)
    }
  })



  const handleClaim = async () => {
    try {
      if (Number(reward) <= 0) {
        toast.error("ZERO_BALANCE");
        return;
      }
      if (loading_states.claimingReward) return;
      let account = window.Wallet?.Account;
      dispatch(updateLoadingStates({ claimingReward: true }));
      if (!account) {
        account = (await handleConnect({}))?.account;
      }

      const contract = getWalletProviderContract();

      const call = contract?.populate("claim_reward")
      const outsideExecutionPayload = await account!.getOutsideExecutionPayload({ calls: [call!] });

      const event = new CustomEvent("MAKE_OUTSIDE_EXECUTION_CALL", {
        detail: {
          type: "WITHDRAWAL",
          payload: outsideExecutionPayload
        },
      });
      window.dispatchEvent(event);
    } catch (error: any) {
      console.log(error);
      toast.error(
        error.response?.data?.message
          ? parse_error(error.response?.data?.message)
          : error.message || "An error occurred"
      );
      dispatch(updateLoadingStates({ claimingReward: false }))
    }
  }

  return (
    <div onClick={() => {
      if (showShareOptions) {
        setShowShareOptions(false)
      }
    }} className="">




      <div className="md:my-10 my-5">
        <Title title="Profile" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-end justify-center w-[184px] h-[184px] rounded-full bg-gray-400 overflow-hidden">
          <img
            className="w-full h-full bg-[#C9F2E9] rounded-full"
            src={generateAvatarFromAddress(profile?.address)}

            alt="profile"
          />
        </div>


      </div>

      <div className="flex flex-col items-center justify-center mt-">

        <p className="mt-[38px] md:text-[36px] capitalize text-[20px] font-[Rubik] font-medium dark:text-spl-white">
          {profile?.username}
        </p>
        <div className="flex mt-[10px] items-center gap-1">
          <p className=" md:text-[24px] text-[15px] dark:text-spl-white">
            {connected_address
              ? `${connected_address.slice(0, 6)}... ${connected_address.slice(
                -4
              )}`
              : ""}
          </p>
          {connected_address ? <button onClick={async () => {
            await navigator.clipboard.writeText(connected_address ?? "")
            toast.success("Address copied to clipboard");
          }}>
            <Clipboard className="text-black dark:text-white" size={17} />
          </button> : null}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-[40px] lg:px-0 md:px-16 px-3 gap-[34px]">
        <div className="lg:w-[832px] w-full h-fit p-[36px] dark:bg-[#042822] bg-spl-green-300 md:rounded-[45px] rounded-[20px]">
          <div className="flex justify-between items-center">
            <div className="">
              <div className="md:w-[235px] flex flex-col items-center justify-center">
                <img
                  src={STAR_ICON}
                  alt="ICON"
                  className="md:w-[54px] w-[23px] md:h-[54px] h-[23px]"
                />
                <p className="text-[#FFFFFF]/[0.5] font-[Rubik] font-medium md:text-[27px] text-[12px] md:leading-[40px] text-center mt-2">
                  POINTS
                </p>
                <p className="text-[#FFFFFF] font-[Rubik] font-medium md:text-[36px] text-[15px]">
                  {rankAndPoint?.point ?? "--"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center">
              <div className="md:w-[235px] flex flex-col items-center justify-center">
                <img
                  src={RANK_ICON}
                  alt="ICON"
                  className="md:w-[54px] w-[23px] md:h-[54px] h-[23px]"
                />
                <p className="text-[#FFFFFF]/[0.5] font-[Rubik] font-medium md:text-[27px] text-[12px] md:leading-[40px] text-center mt-2">
                  LOCAL RANK
                </p>
                <p className="text-[#FFFFFF] font-[Rubik] font-medium md:text-[36px] text-[15px]">
                  #{rankAndPoint?.rank ?? "--"}
                </p>
              </div>
            </div>
          </div>

          {rankAndPoint?.rank && rankAndPoint.rank > 0 ? (
            <div className="flex items-center mt-10 justify-center relative">
              {/* Share options component */}
              {showShareOptions && (
                <ShareOptions
                  text={`🏆 BOOM! Just hit Rank #${rankAndPoint?.rank} on @splxgg! My football predictions are 🔥. Think you can do better? Game on! 👉 ${window.location.origin} #Play_Predict_Win #PredictionKing #SPL`}
                  isDarkMode={isDark}
                  className="absolute w-64 left-1/2 bottom-10 transform -translate-x-1/2"
                  style={{
                    marginTop: '-70px',
                    zIndex: 20
                  }}
                />
              )}
              <Button
                onClick={() => {
                  setShowShareOptions(!showShareOptions);
                }}
                text="Share your progress"
                icon={<Share2 size={15} />}
                fontSize="md:text-[20px] text-xs rounded-[5px]"
                height="md:h-[76px] h-[43px]"
                width="md:w-[484px] w-[219px]"
              />
            </div>
          ) : null}
        </div>

        <div className="lg:w-[832px] w-full h-fit p-[36px] dark:bg-[#042822] bg-spl-green-300 md:rounded-[45px] rounded-[20px] flex flex-col items-center justify-center">
          <p className="text-spl-white md:text-[24px] text-[15px]">
            Available to claim
          </p>
          <p className="text-spl-white font-bold md:text-[30px] text-[15px] md:mt-5 mt-2">
            {Number(reward).toFixed(3)} <span className="text-[10px]">USDC</span>
          </p>

          <div className="md:mt-[60px] mt-[20px]">
            <Button
              disabled={loading_states.claimingReward}
              loading={loading_states.claimingReward}
              onClick={handleClaim}
              text="Claim reward"
              fontSize="md:text-[20px] text-xs rounded-[5px]"
              height="md:h-[76px] h-[43px]"
              width="md:w-[484px] w-[219px]"
            />
          </div>
        </div>

        <div className=" flex justify-center items-center w-full">
          {connected_address ? (
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-spl-white text-[15px] font-bold font-[Lato] py-[10px] px-[20px] rounded-[10px] w-[277px] h-[50px]"
            >
              Disconnect Wallet
            </button>
          ) : (
            <Button
              onClick={() => handleConnect({})}
              text="Connect wallet"
              fontSize="md:text-[24px] text-[15px] w-full rounded-[5px]"
              height="md:h-[76px] h-[50px]"
              width="md:w-[484px] w-[209px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
