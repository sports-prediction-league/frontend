import { useContext, useEffect, useState } from "react";
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
import {
  calculateScore,
  formatTimeNative,
  TEN_MINUTES_IN_MS,
} from "src/lib/utils";

const PredictionCard = ({
  match,
  keyIndex,
  onStakeClick,
  predicting,
  onSeeStatsClick,
  onExplorePredictionsClick,
  onChangePrediction,
}: IPredictionCardProps) => {
  const { mode } = useContext(ThemeContext)!;

  // Helper function to truncate names after 6 characters
  const truncateName = (name: string) =>
    name.length > 6 ? `${name.slice(0, 6)}...` : name;

  const currentTime = new Date(); // Get the current time
  const targetDate = new Date(match.details.fixture.date);

  const [closed_prediction, set_closed_prediction] = useState(false);
  useEffect(() => {
    set_closed_prediction(
      targetDate.getTime() - currentTime.getTime() <= TEN_MINUTES_IN_MS
    );
  }, [match]);

  return (
    <div className="lg:w-[834px] w-[calc(100vw-5vw)] md:h-[390px] h-fit py-3 md:py-0 px-3  lg:px-[69px] rounded-xl md:rounded-[20px] dark:bg-[#042822] bg-spl-white lg:border-[2px] border-[0.5px] md:border-[#E4E5E5] border-[#E4E5E5] dark:border-[rgba(255,255,255,.5)] flex flex-col items-center justify-center shadow-sm">
      <p className="dark:text-spl-white text-spl-black text-[10px] lg:text-[15px] lg:leading-[20px] leading-[12px]">
        {match.details.league.name}
      </p>
      <p className="dark:text-spl-white md:my-0 my-5 text-spl-black text-[10px] lg:text-[13px] lg:leading-[17px] leading-[12px] md:mt-3 mt-[9px]">
        {formatTimeNative(match.details.fixture.date)}
      </p>

      <div className="flex items-center justify-center gap-[35px]">
        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={`https://img.sportradar.com/ls/crest/big/${match.details.teams.home.id}.png`}
            alt="TEAM"
            // onError={(e) => {
            //   (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
            //   (e.target as HTMLImageElement).src = JERSEY;
            // }}
            onLoad={(event) => {
              const img = event.currentTarget;
              const { naturalWidth, naturalHeight } = img;

              if (naturalHeight === 1 && naturalWidth == 1) {
                (img as HTMLImageElement).src =
                  "https://widgets.sir.sportradar.com/assets/media/highlight.b1ac6c3e.png";
              }
            }}
            className="md:w-[129px] w-[40px] smm:w-[55px] md:h-[129px] h-[40px] smm:h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-sm md:leading-[38px] leading-[0px] font-[Lato] font-bold">
            {truncateName(match.details.teams.home.name)}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[10px]">
          <div className="flex items-center justify-center gap-[14px]">
            {closed_prediction ? (
              <div className="md:w-[112px] flex items-center justify-center outline-none  text-white md:text-[59px] text-[14px] text-center leading-[48px] font-black w-[38px] smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] bg-input-gradient">
                <p>{match.details.goals?.away ?? 0}</p>
              </div>
            ) : (
              <input
                className={`md:w-[112px] outline-none w-[38px] smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] ${
                  closed_prediction || match.predicted || predicting
                    ? "dark:border-[#ffffff]/[0.5] dark:text-[#ffffff]/[0.8]"
                    : "dark:border-spl-white border dark:text-spl-white"
                } flex items-center justify-center border border-[#0000000D] bg-transparent  text-spl-black md:text-[59px] text-[14px] text-center leading-[48px] font-black`}
                onChange={(e) => {
                  onChangePrediction(match.details.fixture.id.toString(), {
                    home: e.target.value.trim(),
                    keyIndex,
                  });
                }}
                defaultValue={
                  match.predictions?.length
                    ? match.predictions[0].prediction.split(":")[0].trim()
                    : ""
                }
                placeholder=""
                disabled={closed_prediction || match.predicted || predicting}
              />
            )}
            <img
              src={mode === "dark" ? COLUN : COLUN_DARK}
              alt="COLUN"
              className="md:w-[22px] w-[5px] smm:w-[8px] md:h-[76px] h-[23px]"
            />
            {closed_prediction ? (
              <div className="md:w-[112px] flex items-center justify-center outline-none  text-white md:text-[59px] text-[14px] text-center leading-[48px] font-black w-[38px] smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] bg-input-gradient">
                <p>{match.details.goals?.home ?? 0}</p>
              </div>
            ) : (
              <input
                className={`md:w-[112px] outline-none w-[38px] smm:text-[20px] smm:w-[48px] md:h-[115px] h-[40px] smm:h-[48px] px-2 md:rounded-[20px] rounded-[6px] ${
                  closed_prediction || match.predicted || predicting
                    ? "dark:border-[#ffffff]/[0.5] dark:text-[#ffffff]/[0.8]"
                    : "dark:border-spl-white border dark:text-spl-white"
                } flex items-center justify-center border border-[#0000000D] bg-transparent  text-spl-black md:text-[59px] text-[14px] text-center leading-[48px] font-black`}
                onChange={(e) => {
                  onChangePrediction(match.details.fixture.id.toString(), {
                    away: e.target.value.trim(),
                    keyIndex,
                  });
                }}
                defaultValue={
                  match.predictions?.length
                    ? match.predictions[0].prediction.split(":")[1].trim()
                    : ""
                }
                disabled={closed_prediction || match.predicted || predicting}
                placeholder=""
              />
            )}
          </div>

          <p className="dark:text-spl-white text-spl-black md:text-[21px] text-[10px] md:leading-[27px] leading-[12px] font-light">
            {closed_prediction
              ? match.details.fixture.status.short !== "F"
                ? "Current Result"
                : " Final Result"
              : " Your Prediction"}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-[18px]">
          <img
            src={`https://img.sportradar.com/ls/crest/big/${match.details.teams.away.id}.png`}
            alt="TEAM"
            className="md:w-[129px] w-[40px] smm:w-[55px] md:h-[129px] h-[40px] smm:h-[55px]"
          />
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-sm md:leading-[38px] leading-[0px] font-[Lato] font-bold">
            {truncateName(match.details.teams.away.name)}
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-[16px] mt-[34px]">
        {closed_prediction ? (
          <div className="flex md:hidden flex-col items-center md:w-auto w-full text-white rounded-md py-1 px-6 justify-center bg-input-gradient text-center">
            {match.predicted ? (
              <p className="text-xs">
                Your Prediction:{" "}
                {match.predictions?.length
                  ? match.predictions[0].prediction.split(":")[0].trim()
                  : ""}{" "}
                :{" "}
                {match.predictions?.length
                  ? match.predictions[0].prediction.split(":")[1].trim()
                  : ""}
              </p>
            ) : null}
            <p className="text-xs">
              Your Score:{" "}
              {match.details.fixture.status.short !== "F"
                ? "in progress"
                : match.details.goals && match.predicted
                ? calculateScore(
                    match.details.goals,
                    match.predictions[0].prediction
                  )
                : 0}
            </p>
          </div>
        ) : null}
        <div className="md:min-w-[195px] w-full md:h-[91px] h-[46px] px-2 md:rounded-[20px] rounded-[6px] dark:border-spl-white md:border border-[0.5px] border-[#0000000D] flex items-center justify-center">
          <p className="dark:text-spl-white text-spl-black md:text-[32px] text-[20px] text-center md:leading-[38px] leading-[24px] font-bold font-[Lato]">
            10000
            <small className="dark:text-spl-white text-spl-black md:text-[15px] text-[10px] md:leading-[19px] leading-[12px] font-[Lato]">
              USDC
            </small>
          </p>
        </div>

        {closed_prediction ? (
          <div className="bg-input-gradient md:h-[90px] text-white h-[39px] md:min-w-[267px] w-full sm:block hidden md:text-[32px] text-[12px] md:rounded-[12px] rounded-[6px]">
            <div className="flex items-center w-full h-full justify-center flex-col">
              <div className="flex flex-col gap-2 items-start">
                {match.predicted ? (
                  <p className="text-sm">
                    Your Prediction:{" "}
                    {match.predictions.length
                      ? match.predictions[0].prediction.split(":")[0].trim()
                      : ""}{" "}
                    :{" "}
                    {match.predictions.length
                      ? match.predictions[0].prediction.split(":")[1].trim()
                      : ""}
                  </p>
                ) : null}
                <p className="text-sm">
                  Your Score:{" "}
                  {match.details.fixture.status.short !== "F"
                    ? "in progress"
                    : match.details.goals && match.predicted
                    ? calculateScore(
                        match.details.goals,
                        match.predictions[0].prediction
                      )
                    : 0}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Button
            text="Stake"
            disabled={closed_prediction || match.predicted || predicting}
            height="md:h-[90px] h-[39px]"
            width="md:min-w-[267px] w-full sm:block hidden"
            fontSize="md:text-[32px] text-[12px]"
            onClick={onStakeClick}
            rounded="md:rounded-[12px] rounded-[6px]"
            background={
              closed_prediction
                ? "linear-gradient(219.65deg, #757575 3.77%, #DBDBDB 49.02%, #B7B7B7 67.48%, #B7B7B7 71.75%, #B7B7B7 98.1%)"
                : undefined
            }
          />
        )}

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
              disabled={closed_prediction || match.predicted || predicting}
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
