// components
import Title from "../../../common/components/tittle/Title";
import { useState, useEffect } from "react";

// assets
import PROFILE from "../../../assets/profile/profile.svg";
import BADGE from "../../../assets/leaderboard/badge.svg";
import STAR_ICON from "../../../assets/profile/star_icon.svg";
import RANK_ICON from "../../../assets/profile/rank_icon.svg";

// styles
import "./styles.css";
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
    <div className="profile-container">
      <Title title="Profile" fontSizeSmall="35px" fontSizeMedium="35px" />

      <div className="flex flex-col items-center justify-center">
        <div className="profile-container-image">
          <img src={PROFILE} alt="profile" />
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <img
              src={BADGE}
              alt="Badge"
              className="badge-image"
              style={{ left: `${progress - 7}%` }}
            />
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Until next badge</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-[70px]">
        <Button text="See all badges" fontSize="text-[10px]" />

        <p className="username">Madelyn Dias</p>
        <p className="user-address">xe2d3A...Ac72EBea1</p>
      </div>

      <div className="flex flex-col items-center justify-center mt-[40px] gap-[34px]">
        <div className="profile-points-card">
          <div className="flex-1">
            <div className="md:w-[235px] flex flex-col items-center md:justify-center">
              <img src={STAR_ICON} alt="ICON" className="md:w-[100px] w-[50px] md:h-[100px] h-[50px]"/>
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
              <img src={RANK_ICON} alt="ICON" className="md:w-[100px] w-[50px] md:h-[100px] h-[50px]"/>
              <p className="text-[#FFFFFF]/[0.5] font-[Rubik] font-medium md:text-[27px] text-[12px] md:leading-[40px] text-center mt-2">
                LOCAL RANK
              </p>
              <p className="text-[#FFFFFF] font-[Rubik] font-medium md:text-[36px] text-[15px]">
                #56
              </p>
            </div>
          </div>
        </div>

        <div className="profile-withdraw-card">
          <p className="text-spl-white md:text-[24px] text-[15px]">Available for withdrawal</p>
          <p className="text-spl-white font-bold md:text-[30px] text-[15px] md:mt-5 mt-2">632.000</p>

          <div className="md:mt-[60px] mt-[20px]">
            <Button text="Withdraw" fontSize="md:text-[24px] text-[15px] rounded-[5px]" height="md:h-[76px] h-[33px]" width="md:w-[484px] w-[209px]"/>
          </div>
        </div>

        <div className="mt-[57px]">
          <button className="disconnect-button">Disconnect Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
