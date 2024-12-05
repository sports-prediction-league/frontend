import React from "react";
import Title from "../../../common/components/tittle/Title";
import LeaderBoardHero from "../components/LeaderBoardHero";

const LeaderBoard = () => {
  return (
    <React.Fragment>
      <div className="md:mt-[120px] mt-[20px] mb-[35px]">
        <Title title="Leaderboard" />
      </div>
      <LeaderBoardHero />
    </React.Fragment>
  );
};

export default LeaderBoard;
