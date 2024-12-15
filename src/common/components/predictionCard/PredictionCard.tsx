import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

// interfaces
import { IPredictionCardProps } from "../../../interfaces/components/predictionCardProps";

// components
import Button from "../button/Button";

// assets
import FC_CHELSEA from "../../../assets/toTrash/fc_chelsea_logo.svg";
import FC_LEICESTER from "../../../assets/toTrash/fc_leicester_city_logo.svg";
import COLUN from "../../../assets/upComingMatches/colun.svg";
import COLUN_DARK from "../../../assets/upComingMatches/colun_dark.svg";
import BX_STATS from "../../../assets/buttons/bx_stats.svg";
import USERS_SOLID from "../../../assets/buttons/users_solid.svg";

// styles
// import "./styles.css";

const PredictionCard = ({
  title,
  subtitle,
  team1Name,
  team1Score,
  team2Name,
  team2Score,
  stakeAmount,
  onStakeClick,
  onSeeStatsClick,
  onExplorePredictionsClick,
}: IPredictionCardProps) => {
  const { mode } = useContext(ThemeContext)!;

  // State to manage score input values
  const [scores, setScores] = useState({
    team1Score: team1Score || "",
    team2Score: team2Score || "",
  });

  // Helper function to truncate names after 6 characters
  const truncateName = (name: string) => (name.length > 6 ? `${name.slice(0, 6)}...` : name);

  // Handle input change
  const handleScoreChange = (team: "team1Score" | "team2Score", value: string) => {
    if (!isNaN(Number(value))) {
      setScores((prevScores) => ({ ...prevScores, [team]: value }));
    }
  };

  return (
    <div className="lg:w-[834px] w-full md:h-[390px] h-fit py-3 md:py-0 px-[30px] md:px-[69px] rounded-[20px] dark:bg-[#042822] bg-spl-white md:border-[2px] border-[0.5px] border-[#E4E5E5] flex flex-col items-center justify-center shadow-sm">
      <p className="dark:text-spl-white text-spl-black text-[10px] md:text-[15px] md:leading-[20px] leading-[12px]">{title}</p>
      <p className=" dark:text-spl-white text-spl-black text-[10px] md:text-[13px] md:leading-[17px] leading-[12px] mt-[9px]">{subtitle}</p>

      <div className="flex w-full items-center justify-center lg:gap-[35px] sm:gap-[20px] gap-[10px]">
        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={FC_CHELSEA}
            alt="TEAM"
            className="md:w-[129px] w-[55px] md:h-[129px] h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[14px] md:leading-[38px] leading-[16px] font-[Lato] font-bold">{truncateName(team1Name)}</p>
        </div>

        <div className="flex flex-col items-center justify-center lg:gap-[10px] gap-[5px]">
          <div className="flex w-full items-center justify-center gap-[14px]">
            <input
              className="md:w-[112px] w-[48px] md:h-[115px] h-[50px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white border border-[#0000000D] flex items-center justify-center bg-transparent dark:text-spl-white text-spl-black md:text-[59px] text-[24px] text-center leading-[48px] font-black"
              value={scores.team1Score}
              onChange={(e) => handleScoreChange("team1Score", e.target.value)}
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
              onChange={(e) => handleScoreChange("team2Score", e.target.value)}
              placeholder="0"
            />
          </div>

          <p className="dark:text-spl-white text-spl-black md:text-[21px] text-[10px] md:leading-[27px] leading-[12px] font-light">Your Prediction</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={FC_LEICESTER}
            alt="TEAM"
            className="md:w-[129px] w-[55px] md:h-[129px] h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[14px] md:leading-[38px] leading-[16px] font-[Lato] font-bold">{truncateName(team2Name)}</p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-[16px] mt-[34px]">
        <div className="md:min-w-[195px] w-full md:h-[91px] h-[46px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white md:border border-[0.5px] border-[#0000000D] flex items-center justify-center">
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[20px] text-center md:leading-[38px] leading-[24px] font-bold font-[Lato]">
            {stakeAmount}
            <small className="dark:text-spl-white text-spl-black md:text-[15px] text-[10px] md:leading-[19px] leading-[12px] font-[Lato]">eth</small>
          </p>
        </div>

        <Button
          text="Stake"
          height="md:h-[90px] h-[39px]"
          width="md:min-w-[267px] w-full"
          fontSize="md:text-[32px] text-[12px]"
          onClick={onStakeClick}
          rounded="md:rounded-[12px] rounded-[6px]"
        />

        <div className="md:w-fit w-full flex flex-col items-center justify-center gap-1">
          <Button
            text="See team stats"
            height="md:h-[43px] h-[32px]"
            width="md:w-[196px] w-full"
            fontSize="md:text-[10px] text-[10px]"
            leftIcon={BX_STATS}
            rounded="md:rounded-[12px] rounded-[6px]"
            onClick={onSeeStatsClick}
          />
          <Button
            text="Explore Predictions"
            height="md:h-[43px] h-[32px]"
            width="md:w-[196px] w-full"
            fontSize="md:text-[10px] text-[10px]"
            leftIcon={USERS_SOLID}
            rounded="md:rounded-[12px] rounded-[6px]"
            onClick={onExplorePredictionsClick}
          />
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
