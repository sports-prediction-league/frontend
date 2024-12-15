// common components
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";
import Title from "../../../common/components/tittle/Title";

// styles
// import "./styles.css";

const UpcomingMatches = () => {
  return (
    <div className="max-w-full flex flex-col items-center justify-center md:py-[70px] py-[24px] lg:px-[90px] px-[16px]">
      <Title title="Upcoming Matches" />

      <div className="md:flex hidden justify-end w-full mt-7">
        <div className="md:w-[371px] w-[115px] md:h-[64px] h-[30px] md:rounded-[20px] rounded-[10px] dark:bg-spl-green-100 bg-spl-white dark:border-none md:border border-[0.5px] border-spl-black flex items-center justify-center">
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[10px] font-[Lato] md:leading-[38px] leading-[12px] font-bold">
            Sat, November 23nd
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center flex-col flex-wrap gap-[63px] md:mt-[63px] mt-[7px]">
        <PredictionCard
          title="Premier League"
          subtitle="7:00pm"
          team1Name="Chelsea"
          team1Score={2}
          team2Name="Leicester C"
          team2Score={2}
          stakeAmount="21"
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
          stakeAmount="21"
          onStakeClick={() => {}}
          onSeeStatsClick={() => {}}
          onExplorePredictionsClick={() => {}}
        />
      </div>
    </div>
  );
};

export default UpcomingMatches;
