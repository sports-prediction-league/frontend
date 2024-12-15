// common components
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";
import Title from "../../../common/components/tittle/Title";

const UpcomingMatches = () => {
  return (
    <div className="max-w-full flex flex-col items-center justify-center md:py-[70px] py-[24px] md:px-[90px] px-[16px]">
      <Title title="Upcoming Matches" />

      <div className="md:flex hidden justify-end w-full mt-5">
        <div className="w-[371px] h-[98px] rounded-[20px] dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-[#0000000D] flex items-center justify-center">
          <p className="dark:text-spl-white text-spl-black text-[32px] font-[Lato] leading-[38px] font-bold">
            Sat, November 23nd
          </p>
        </div>
      </div>

      <div className="flex flex-col flex-wrap gap-[63px] md:mt-[63px] mt-[7px]">
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
