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
import "./styles.css";

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
    <div className="prediction-card shadow-sm">
      <p className="prediction-card-title">{title}</p>
      <p className="prediction-card-subtitle">{subtitle}</p>

      <div className="teams-scores-container">
        <div className="team">
          <img
            src={FC_CHELSEA}
            alt="TEAM"
            className="md:w-[129px] w-[55px] md:h-[129px] h-[55px]"
          />
          <p className="team-name">{truncateName(team1Name)}</p>
        </div>

        <div className="scors-container">
          <div className="scores">
            <input
              className="score-card"
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
              className="score-card"
              value={scores.team2Score}
              onChange={(e) => handleScoreChange("team2Score", e.target.value)}
              placeholder="0"
            />
          </div>

          <p className="your-prediction-text">Your Prediction</p>
        </div>

        <div className="team">
          <img
            src={FC_LEICESTER}
            alt="TEAM"
            className="md:w-[129px] w-[55px] md:h-[129px] h-[55px]"
          />
          <p className="team-name">{truncateName(team2Name)}</p>
        </div>
      </div>

      <div className="staking-container">
        <div className="stacking-number-card">
          <p className="stacking-number-card-number">
            {stakeAmount}
            <small>eth</small>
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

        <div className="prediction-stats">
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
