// components
import Title from "../../../common/components/tittle/Title";
import { useState, useEffect } from "react";

// assets
import PROFILE from "../../../assets/profile/profile.svg";
import BADGE from "../../../assets/leaderboard/badge.svg";
import STAR_ICON from "../../../assets/profile/star_icon.svg";
import RANK_ICON from "../../../assets/profile/rank_icon.svg";

import Button from "../../../common/components/button/Button";

const Profile = () => {
  const [progress, setProgress] = useState(10);

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  useEffect(() => {
    updateProgress(100);
  }, []);

  return (
    <div className="md:mt-[122px] mt-[50px]">
      <Title title="Profile" fontSizeSmall="35px" fontSizeMedium="35px" />

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-end justify-center w-[184px] h-[184px] rounded-full bg-gray-400 overflow-hidden">
          <img src={PROFILE} alt="profile" />
        </div>

        <div className="text-center w-[250px] h-[5px] mx-auto mt-[50px] relative">
          <div className="relative h-[5px] bg-[#e0e0e0] rounded-[5px] m-[10px_0]">
            <img
              src={BADGE}
              alt="Badge"
              className="w-[32px] h-[32px] absolute top-[-35px]"
              style={{ left: `${progress - 7}%` }}
            />
            <div
              className="bg-gradient-to-r from-[#2ec4b6] to-[#a6cee3] rounded-[5px] h-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-[10px] text-[14px] text-gray-600">
            Until next badge
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-[70px]">
        <Button text="See all badges" fontSize="text-[10px]" />

        <p className="mt-[38px] md:text-[36px] text-[20px] font-[Rubik] font-medium dark:text-spl-white">
          Madelyn Dias
        </p>
        <p className="mt-[10px] md:text-[24px] text-[15px] dark:text-spl-white">
          xe2d3A...Ac72EBea1
        </p>
      </div>

      <div className="flex flex-col items-center justify-center mt-[40px] gap-[34px]">
        <div className="md:w-[832px] w-[360px] h-fit p-[36px] dark:bg-[#042822] bg-spl-green-300 md:rounded-[45px] rounded-[20px] flex justify-between items-center">
          <div className="flex-1">
            <div className="md:w-[235px] flex flex-col items-center md:justify-center">
              <img
                src={STAR_ICON}
                alt="ICON"
                className="md:w-[54px] w-[23px] md:h-[54px] h-[23px]"
              />
              <p className="text-[#FFFFFF]/[0.5] font-[Rubik] font-medium md:text-[27px] text-[12px] md:leading-[40px] text-center mt-2">
                POINTS
              </p>
              <p className="text-[#FFFFFF] font-[Rubik] font-medium md:text-[36px] text-[15px]">
                590
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end justify-center">
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
                #56
              </p>
            </div>
          </div>
        </div>

        <div className="md:w-[832px] w-[360px] h-fit p-[36px] dark:bg-[#042822] bg-spl-green-300 md:rounded-[45px] rounded-[20px] flex flex-col items-center justify-center">
          <p className="text-spl-white md:text-[24px] text-[15px]">
            Available for withdrawal
          </p>
          <p className="text-spl-white font-bold md:text-[30px] text-[15px] md:mt-5 mt-2">
            632.000
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

        <div className="mt-[57px]">
          <button className="bg-red-600 text-spl-white text-[15px] font-bold font-[Lato] py-[10px] px-[20px] rounded-[10px] w-[277px] h-[56px]">
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
