import React from "react";
import Title from "../../../common/components/tittle/Title";
import LeaderBoardHero from "../components/LeaderBoardHero";
import PointCard from "../components/PointCard";

const LeaderBoard = () => {
  return (
    <React.Fragment>
      <div className="md:my-10 my-5 md:mb-20">
        <Title title="Leaderboard" />
      </div>
      <LeaderBoardHero />

      <div className="flex flex-col justify-center items-center gap-[14px] md:mt-[72px] mt-[24px] w-full px-3">
        <PointCard active={false} />
        <PointCard active={true} />
      </div>
    </React.Fragment>
  );
};

export default LeaderBoard;
