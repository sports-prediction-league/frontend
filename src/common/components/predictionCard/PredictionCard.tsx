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
  const truncateName = (name: string) =>
    name.length > 6 ? `${name.slice(0, 6)}...` : name;

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
    <div className="lg:w-[834px] w-[calc(100vw-5vw)] md:h-[390px] h-fit py-3 md:py-0 px-3  lg:px-[69px] rounded-xl md:rounded-[20px] dark:bg-[#042822] bg-spl-white lg:border-[2px] border-[0.5px] md:border-[#E4E5E5] border-[#E4E5E5] dark:border-[rgba(255,255,255,.5)] flex flex-col items-center justify-center shadow-sm">
      <p className="dark:text-spl-white text-spl-black text-[10px] lg:text-[15px] lg:leading-[20px] leading-[12px]">
        {title}
      </p>
      <p className="dark:text-spl-white md:my-0 my-5 text-spl-black text-[10px] lg:text-[13px] lg:leading-[17px] leading-[12px] mt-[9px]">
        {subtitle}
      </p>

      <div className="flex items-center justify-center gap-[35px]">
        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={FC_CHELSEA}
            alt="TEAM"
            className="md:w-[129px] w-[40px] smm:w-[55px] md:h-[129px] h-[40px] smm:h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-sm md:leading-[38px] leading-[0px] font-[Lato] font-bold">
            {truncateName(team1Name)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[10px]">
          <div className="flex items-center justify-center gap-[14px]">
            <input
              className="md:w-[112px] w-[38px] outline-none smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white border border-[#0000000D] flex items-center justify-center bg-transparent dark:text-spl-white text-spl-black md:text-[59px] text-[14px] text-center leading-[48px] font-black"
              value={scores.team1Score}
              onChange={(e) => handleScoreChange("team1Score", e.target.value)}
              placeholder="0"
            />
            <img
              src={mode === "dark" ? COLUN : COLUN_DARK}
              alt="COLUN"
              className="md:w-[22px] w-[5px] smm:w-[8px] md:h-[76px] h-[23px]"
            />
            <input
              className="md:w-[112px] outline-none w-[38px] smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white border border-[#0000000D] flex items-center justify-center bg-transparent dark:text-spl-white text-spl-black md:text-[59px] text-[14px] text-center leading-[48px] font-black"
              value={scores.team2Score}
              onChange={(e) => handleScoreChange("team2Score", e.target.value)}
              placeholder="0"
            />
          </div>

          <p className="dark:text-spl-white text-spl-black md:text-[21px] text-[10px] md:leading-[27px] leading-[12px] font-light">
            Your Prediction
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={FC_LEICESTER}
            alt="TEAM"
            className="md:w-[129px] w-[40px] smm:w-[55px] md:h-[129px] h-[40px] smm:h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-sm md:leading-[38px] leading-[0px] font-[Lato] font-bold">
            {truncateName(team2Name)}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-[16px] mt-[34px]">
        <div className="md:min-w-[195px] w-full md:h-[91px] h-[46px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white md:border border-[0.5px] border-[#0000000D] flex items-center justify-center">
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[20px] text-center md:leading-[38px] leading-[24px] font-bold font-[Lato]">
            {stakeAmount}
            <small className="dark:text-spl-white text-spl-black md:text-[15px] text-[10px] md:leading-[19px] leading-[12px] font-[Lato]">
              STRK
            </small>
          </p>
        </div>

        <Button
          text="Stake"
          height="md:h-[90px] h-[39px]"
          width="md:min-w-[267px] w-full sm:block hidden"
          fontSize="md:text-[32px] text-[12px]"
          onClick={onStakeClick}
          rounded="md:rounded-[12px] rounded-[6px]"
        />

        <div className="grid grid-cols-12 gap-2 w-full sm:hidden">
          <div className="col-span-6 w-full">
            <div className="grid gap-1 w-full grid-cols-2">
              <Button
                text=""
                // height="md:h-[43px] h-[32px]"
                // width="md:w-[196px] w-full"
                fontSize="md:text-[10px] text-[7px] w-full"
                leftIcon={BX_STATS}
                rounded="md:rounded-[12px] rounded-[6px]"
                onClick={onSeeStatsClick}
              />
              <Button
                text=""
                // height="md:h-[43px] h-[32px]"
                // width="md:w-[196px] w-full"
                fontSize="md:text-[10px] text-[7px] w-full"
                leftIcon={USERS_SOLID}
                rounded="md:rounded-[12px] rounded-[6px]"
                onClick={onExplorePredictionsClick}
              />
            </div>
          </div>
          <div className="col-span-6 w-full">
            <Button
              text="Stake"
              width="w-full"
              fontSize="md:text-[32px] text-[12px]"
              onClick={onStakeClick}
              rounded="md:rounded-[12px] rounded-[6px]"
            />
          </div>
        </div>

        <div className="md:w-fit w-full sm:flex flex-col hidden items-center justify-center gap-1">
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
