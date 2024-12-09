import React from "react";
import Title from "../../../common/components/tittle/Title";
import LeaderBoardHero from "../components/LeaderBoardHero";
import PointCard from "../components/PointCard";

const LeaderBoard = () => {
  return (
    <React.Fragment>
      <div className="md:mt-[120px] mt-[20px] mb-[35px]">
        <Title title="Leaderboard" />
      </div>
      <LeaderBoardHero />

      <div className="flex flex-col justify-center items-center gap-[14px] md:mt-[72px] mt-[24px] w-full md:px-0 px-4">
        <PointCard active={false} />
        <PointCard active={true} />
      </div>
    </React.Fragment>
  );
};

export default LeaderBoard;
