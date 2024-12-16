import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

// components
import Title from "../../../common/components/tittle/Title";
import UpcomingMatches from "../../home/components/UpcomingMatches";

// assets
import COLUN from "../../../assets/upComingMatches/colun.svg";
import COLUN_DARK from "../../../assets/upComingMatches/colun_dark.svg";
import LEICESTER from "../../../assets/matchTracker/leicester.svg";
import CHELSEA from "../../../assets/matchTracker/chelsea.svg";
import GOAL from "../../../assets/matchTracker/goal.svg";

// for the kick off image
import KICKOFF from "../../../assets/matchTracker/kick_off.svg";

const MatchTracker = () => {
  const { mode } = useContext(ThemeContext)!;

  // State to manage score input values
  const [scores, setScores] = useState({
    team1Score: 2 || "",
    team2Score: 2 || "",
  });

  // Handle input change
  const handleScoreChange = (
    team: "team1Score" | "team2Score",
    value: string
  ) => {
    if (!isNaN(Number(value))) {
      setScores((prevScores) => ({ ...prevScores, [team]: value }));
    }
  };

  return (
    <React.Fragment>
      <div className="md:my-10 md:mb-20 my-5">
        <Title title="Match Tracker" />
      </div>

      <div className="flex flex-col lg:px-[90px] px-[16px]">
        <div className="bg-[#00644C] w-full h-[235px] lg:px-[185px] px-[31px] flex items-center justify-center">
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col gap-[4px]">
              <img src={CHELSEA} alt="CHELSEA" />
              <p className="text-spl-white text-[15px]">Chelsea</p>
            </div>

            <div className="flex flex-col items-center justify-center lg:gap-[10px] gap-[5px]">
              <div className="flex w-full items-center justify-center gap-[14px]">
                <input
                  className="md:w-[112px] w-[48px] md:h-[115px] h-[50px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white border border-[#0000000D] flex items-center justify-center bg-transparent dark:text-spl-white text-spl-black md:text-[59px] text-[24px] text-center leading-[48px] font-black"
                  value={scores.team1Score}
                  onChange={(e) =>
                    handleScoreChange("team1Score", e.target.value)
                  }
                  placeholder="0"
                />
                <img
                  src={mode === "dark" ? COLUN : COLUN_DARK}
                  alt="COLUN"
                  className="md:w-[22px] w-[10px] md:h-[76px] h-[33px]"
                />
                <input
                  className="md:w-[112px] w-[48px] md:h-[115px] h-[50px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white border border-[#0000000D] flex items-center justify-center bg-transparent dark:text-spl-white text-spl-black md:text-[59px] text-[24px] text-center leading-[48px] font-black"
                  value={scores.team2Score}
                  onChange={(e) =>
                    handleScoreChange("team2Score", e.target.value)
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[4px]">
              <img src={LEICESTER} alt="LEICESTER" />
              <p className="text-spl-white text-[15px]">Leicester</p>
            </div>
          </div>
        </div>

        <div className="pitch-bg">
          <img
            src={GOAL}
            alt="GOAL"
            className="absolute top-1/2 left-1/2 transform -translate-x-[69%] -translate-y-1/2 lg:w-auto w-[254px] lg:h-auto h-[219px]"
          />{" "}
        </div>
      </div>

      <UpcomingMatches />
    </React.Fragment>
  );
};

export default MatchTracker;
