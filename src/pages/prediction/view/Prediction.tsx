import React from "react";

// components
import PredictionHero from "../components/PredictionHero";
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";

// assets
import FAV_ICON from "../../../assets/prediction/fav_icon.svg";

// styles
// import "./styles.css";

const Prediction = () => {
  return (
    <React.Fragment>
      <PredictionHero />

      <div className="w-full flex flex-col md:gap-[90px] gap-[18px] lg:px-[90px] px-[16px] mt-[45px]">
        <div className="w-full flex flex-col md:gap-[71px] gap-[19px]">
          <div className="w-full flex justify-between items-center">
            <div className="md:w-[263px] w-[152px] md:h-[64px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none md:border border-[0.5px] border-spl-black flex gap-5 items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">Round 1</p>

              <img src={FAV_ICON} alt="ICON" className="md:w-[40px] w-[15px] md:h-[40px] h-[15px]" />
            </div>

            <div className="md:w-[371px] w-[115px] md:h-[64px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none md:border border-[0.5px] border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:gap-[63px] gap-[24px] justify-center items-center">
            <PredictionCard
              title="Premier League"
              subtitle="7:00pm"
              team1Name="Chelsea"
              team1Score={2}
              team2Name="Leicester C"
              team2Score={2}
              stakeAmount="10"
              onStakeClick={() => {}}
              onSeeStatsClick={() => {}}
              onExplorePredictionsClick={() => {}}
            />
          </div>
        </div>

        <div className="w-full flex flex-col md:gap-[71px] gap-[19px]">
          <div className="w-full flex justify-between items-center">
            <div></div>

            <div className="md:w-[371px] w-[115px] md:h-[64px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none md:border border-[0.5px] border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:gap-[63px] gap-[24px] justify-center items-center">
            <PredictionCard
              title="Premier League"
              subtitle="7:00pm"
              team1Name="Chelsea"
              team1Score={2}
              team2Name="Leicester C"
              team2Score={2}
              stakeAmount="10"
              onStakeClick={() => {}}
              onSeeStatsClick={() => {}}
              onExplorePredictionsClick={() => {}}
            />

            <PredictionCard
              title="Premier League"
              subtitle="7:00pm"
              team1Name="Chelsea"
              team1Score={2}
              team2Name="Leicester C"
              team2Score={2}
              stakeAmount="10"
              onStakeClick={() => {}}
              onSeeStatsClick={() => {}}
              onExplorePredictionsClick={() => {}}
            />
          </div>
        </div>

        <div className="w-full flex flex-col md:gap-[71px] gap-[19px]">
          <div className="w-full flex justify-between items-center">
            <div></div>

            <div className="md:w-[371px] w-[115px] md:h-[64px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none md:border border-[0.5px] border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col md:gap-[63px] gap-[24px] justify-center items-center">
            <PredictionCard
              title="Premier League"
              subtitle="7:00pm"
              team1Name="Chelsea"
              team1Score={2}
              team2Name="Leicester C"
              team2Score={2}
              stakeAmount="10"
              onStakeClick={() => {}}
              onSeeStatsClick={() => {}}
              onExplorePredictionsClick={() => {}}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Prediction;
