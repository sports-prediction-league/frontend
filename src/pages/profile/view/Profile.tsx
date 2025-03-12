// components
import Title from "../../../common/components/tittle/Title";
import { useState, useEffect } from "react";

// assets
import PROFILE from "../../../assets/profile/profile.svg";
// import BADGE from "../../../assets/leaderboard/badge.svg";
import STAR_ICON from "../../../assets/profile/star_icon.svg";
import RANK_ICON from "../../../assets/profile/rank_icon.svg";

import Button from "../../../common/components/button/Button";
import { useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";
import { Share2 } from "lucide-react";
import ShareModal from "src/common/components/modal/ShareModal";
import { MINI_APP_URL } from "src/lib/utils";
import ThemeToggle from "src/common/components/theme/ThemeToggle";

const Profile = () => {
  const [progress, setProgress] = useState(10);
  const { handleDisconnect, handleConnect } = useConnect();
  const { profile, connected_address, reward } = useAppSelector(
    (state) => state.app
  );
  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  const [open_modal, set_open_modal] = useState(false);

  useEffect(() => {
    updateProgress(50);
  }, []);

  return (
    <div className="">
      <ShareModal
        modal_title="Share your progress"
        content={{
          message: `🚀 I'm crushing it at #${profile?.point?.rank} on the @HQ_SPL Leaderboard! 🏆 Can you dethrone me? 💪 Prove your prediction skills and take me on in the ultimate sports showdown! ⚽🏀🔥 #PredictPlayWin #SPL`,
          url: MINI_APP_URL,
        }}
        open_modal={open_modal}
        onClose={() => {
          set_open_modal(false);
        }}
      />
      <div className="flex items-center justify-end my-5 mx-3">
        <ThemeToggle />
      </div>
      <div className="md:my-10 my-5">
        <Title title="Profile" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-end justify-center w-[184px] h-[184px] rounded-full bg-gray-400 overflow-hidden">
          <img
            className="w-full h-full rounded-full"
            src={profile?.profile_picture || PROFILE}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
              (e.target as HTMLImageElement).src = PROFILE;
            }}
            alt="profile"
          />
        </div>

        {/* <div className="text-center w-[250px] h-[5px] mx-auto mt-[50px] relative">
          <div className="relative h-[5px] bg-[#e0e0e0] rounded-[5px] m-[10px_0]">
            <img
              src={BADGE}
              alt="Badge"
              className="w-[22px] h-[22px] absolute top-[-25px]"
              style={{ left: `${progress - 5}%` }}
            />
            <div
              className="bg-gradient-to-r from-[#2ec4b6] to-[#a6cee3] rounded-[5px] h-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-[10px] text-[14px] text-gray-600">
            Until next badge
          </p>
        </div> */}
      </div>

      <div className="flex flex-col items-center justify-center mt-[70px]">
        {/* <Button text="See all badges" fontSize="text-[10px]" /> */}

        <p className="mt-[38px] md:text-[36px] text-[20px] font-[Rubik] font-medium dark:text-spl-white">
          {profile?.username}
        </p>
        <p className="mt-[10px] md:text-[24px] text-[15px] dark:text-spl-white">
          {connected_address
            ? `${connected_address.slice(0, 6)}... ${connected_address.slice(
              -4
            )}`
            : ""}
        </p>
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
                  {profile?.point?.point ?? "--"}
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
                  #{profile?.point?.rank ?? "--"}
                </p>
              </div>
            </div>
          </div>

          {profile?.point?.rank && profile?.point?.rank > 0 ? (
            <div className="flex items-center mt-10 justify-center">
              <Button
                onClick={() => {
                  set_open_modal(true);
                }}
                text="Share your progress"
                icon={<Share2 />}
                fontSize="md:text-[24px] text-xs rounded-[5px]"
                height="md:h-[76px] h-[33px]"
                width="md:w-[484px] w-[209px]"
              />
            </div>
          ) : null}
        </div>

        <div className="lg:w-[832px] w-full h-fit p-[36px] dark:bg-[#042822] bg-spl-green-300 md:rounded-[45px] rounded-[20px] flex flex-col items-center justify-center">
          <p className="text-spl-white md:text-[24px] text-[15px]">
            Available for withdrawal
          </p>
          <p className="text-spl-white font-bold md:text-[30px] text-[15px] md:mt-5 mt-2">
            {Number(reward).toFixed(3)}
          </p>

          <div className="md:mt-[60px] mt-[20px]">
            <Button
              text="Withdraw"
              fontSize="md:text-[24px] text-[15px] rounded-[5px]"
              height="md:h-[76px] h-[33px]"
              width="md:w-[484px] w-[209px]"
            />
          </div>
        </div>

        <div className="mt-[57px] flex justify-center items-center w-full">
          {connected_address ? (
            <button
              onClick={handleDisconnect}
              className="bg-red-600 text-spl-white text-[15px] font-bold font-[Lato] py-[10px] px-[20px] rounded-[10px] w-[277px] h-[56px]"
            >
              Disconnect Wallet
            </button>
          ) : (
            <Button
              onClick={handleConnect}
              text="Connect wallet"
              fontSize="md:text-[24px] text-[15px] w-full rounded-[5px]"
              height="md:h-[76px] h-[33px]"
              width="md:w-[484px] w-[209px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
