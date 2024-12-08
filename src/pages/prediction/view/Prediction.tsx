import React from "react";

// components
import PredictionHero from "../components/PredictionHero";
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";

// assets
import FAV_ICON from "../../../assets/prediction/fav_icon.svg";

// styles
import "./styles.css";

const Prediction = () => {
  return (
    <React.Fragment>
      <PredictionHero />

      <div className="prediction-cards-container">
        <div className="fav-prediction-container">
          <div className="fav-prediction-card">
            <div className="fav-button">
              <p className="fav-button-text">Round 1</p>

              <img src={FAV_ICON} alt="ICON" className="fav-icon" />
            </div>

            <div className="md:w-[371px] w-[115px] md:h-[98px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="prediction-card-container">
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

        <div className="fav-prediction-container">
          <div className="fav-prediction-card">
            <div></div>

            <div className="md:w-[371px] w-[115px] md:h-[98px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="prediction-card-container">
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

        <div className="fav-prediction-container">
          <div className="fav-prediction-card">
            <div></div>

            <div className="md:w-[371px] w-[115px] md:h-[98px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-black flex items-center justify-center">
              <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
                Sat, November 23nd
              </p>
            </div>
          </div>

          <div className="prediction-card-container">
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
