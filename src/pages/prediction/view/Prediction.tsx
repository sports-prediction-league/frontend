import React from "react";

// components
import PredictionHero from "../components/PredictionHero";
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";

// assets
import FAV_ICON from "../../../assets/prediction/fav_icon.svg";

const Prediction = () => {
  return (
    <React.Fragment>
      <PredictionHero />

      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px] lg:px-[90px] mt-[45px]">
        <div className="w-full flex flex-col md:gap-[71px] gap-[19px]">
          <div className="w-full px-3 flex justify-between items-center">
            <div className="px-3 py-1 rounded dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-[#0000000D] flex items-center gap-2 justify-center">
              <p className="dark:text-spl-white text-spl-black lg:text-xl text-sm font-[Lato]  font-bold">
                Round 1
              </p>

              <img
                src={FAV_ICON}
                alt="ICON"
                className="lg:w-[20px] w-3 lg:h-[20px] h-3"
              />
            </div>

            <div className="px-3 py-1 rounded-lg dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-[#0000000D] flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black  font-[Lato] lg:text-xl text-sm  font-bold">
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
