import Assets from "src/assets";
import Button from "./Button";
import { MatchData } from "src/state/slices/appSlice";
import {
  calculateScore,
  formatDateNative,
  formatTimeNative,
} from "src/lib/utils";
import { useEffect, useRef, useState } from "react";

interface Props {
  group: MatchData[];
  keyIndex: number;
  predicting: boolean;
  onChangePrediction: (matchId: string, value: any) => void;
}
export default function MakePrediction({
  group,
  keyIndex,
  predicting,
  onChangePrediction,
}: Props) {
  // const dispatch = useAppDispatch();
  // const is_registered = useAppSelector((state) => state.app.is_registered);
  // const { getWalletProviderContract } = useContractInstance();
  const TEN_MINUTES_IN_MS = 10 * 60 * 1000;
  // const [predictions, setPredictions] = useState<Record<string, any>>({});
  // const [predicting, setPredicting] = useState<Record<string, boolean>>({});

  // const applyPrediction = async (matchId: string) => {
  // if (!window.Wallet?.IsConnected) {
  //   toast.error("Wallet not connected!");
  //   return;
  // }
  // if (!is_registered) {
  //   dispatch(setShowRegisterModal(true));
  //   return;
  // }
  //   const home_value = predictions[matchId]?.home;
  //   const away_value = predictions[matchId]?.away;
  //   if (predicting[matchId]) return;
  //   if (!window.Wallet?.IsConnected) return toast.error("Wallet not connected");
  //   if (!home_value?.trim()) return toast.error("Invalid fields");
  //   if (!away_value?.trim()) return toast.error("Invalid fields");
  // if (isNaN(Number(away_value?.trim()))) return toast.error("Invalid fields");
  // if (isNaN(Number(home_value?.trim()))) return toast.error("Invalid fields");

  //   try {
  //     setPredicting({
  //       ...predicting,
  //       [matchId]: true,
  //     });
  // const prediction = `${home_value.trim()}:${away_value.trim()}`;

  //     const contract = getWalletProviderContract();

  //     if (contract) {
  //       await contract.make_prediction(
  //         cairo.felt(matchId.trim()),
  //         cairo.uint256(Number(home_value.trim())),
  //         cairo.uint256(Number(away_value.trim()))
  //       );
  //       dispatch(updatePredictionState({ matchId, keyIndex, prediction }));
  //       onPredict(matchId, prediction);
  //       toast.success("Prediction Successful!");
  //     }
  //   } catch (error: any) {
  //     toast.error(
  //       error?.response?.data?.message ??
  //         error?.message ??
  //         "OOOPPPSS!! Something went wrong"
  //     );
  //   }

  //   setPredicting({
  //     ...predicting,
  //     [matchId]: false,
  //   });
  // };

  const headerOffset = 200; // Adjust this value to match your header's height

  // Set today's date in UTC (without time component)
  const today = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate()
    )
  );

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [has_scrolled, set_has_scrolled] = useState(false);

  useEffect(() => {
    if (!has_scrolled) {
      const todayIndex = group.findIndex((item) => {
        const itemDate = new Date(item.details.fixture.date);
        const itemDateOnly = new Date(
          Date.UTC(
            itemDate.getUTCFullYear(),
            itemDate.getUTCMonth(),
            itemDate.getUTCDate()
          )
        );
        return itemDateOnly.getTime() === today.getTime();
      });

      if (todayIndex !== -1 && itemRefs.current[todayIndex]) {
        const targetPosition =
          (itemRefs.current[todayIndex]?.getBoundingClientRect().top ?? 0) +
          window.scrollY -
          headerOffset;

        // Smoothly scroll to the calculated position
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        set_has_scrolled(true);
      }
    }
  }, [group]);

  return group.length ? (
    <div className="flex flex-col gap-6 w-full">
      <div className="p-4 h-[60px] relative">
        <div className="size-full absolute top-0 left-0 bg-primary-foreground opacity-80">
          <img src={Assets.rough} alt="" className="size-full object-cover" />
        </div>

        <div className="relative flex items-center">
          <h5>{formatDateNative(group[0]?.details.fixture.date)}</h5>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {group.map((match, _key) => {
          const currentTime = new Date(); // Get the current time
          const targetDate = new Date(match.details.fixture.date);
          const closed_prediction: boolean =
            targetDate.getTime() - currentTime.getTime() <= TEN_MINUTES_IN_MS;
          return (
            <div
              ref={(el) => (itemRefs.current[_key] = el)}
              key={_key}
              className="p-2 lg:pt-[64px] pt-[40px] bg-secondary rounded-lg flex flex-col lg:gap-[64px] gap-[40px]"
            >
              <div className="flex flex-col items-center text-center px-3">
                <div className="flex items-center mb-4 gap-2 flex-wrap justify-center">
                  <img src={Assets.stadium} alt="" />
                  <h6 className="opacity-60">
                    {match.details?.fixture.venue.name}
                  </h6>
                </div>

                <div className="flex items-center justify-center sm:flex-row lg:gap-[48px] gap-5 mt-8">
                  <div className="flex-1 lg:w-[250px] flex flex-col items-center gap-3 sm:gap-8">
                    {match.details.teams.home.logo ? (
                      <img
                        src={match.details.teams.home.logo}
                        alt=""
                        className=" lg:flex w-full lg:h-[200px] h-[70px] object-contain"
                      />
                    ) : null}
                    <h2 className="text-center lg:text-4xl text-sm line-clamp-1 lg:line-clamp-2">
                      {match.details.teams.home.name}
                    </h2>

                    {match.details.last_games ? (
                      <div className="flex justify-center items-start gap-2">
                        {match.details.last_games.home?.map((mp, index) => {
                          if (mp === "Win")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-primary-foreground md:border-[3px] border-[2px] border-primary-foreground"
                              ></span>
                            );
                          if (mp === "Draw")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-white md:border-[3px] border-[2px] border-muted-foreground"
                              ></span>
                            );
                          if (mp === "Lose")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-[#EF4444] md:border-[3px] border-[2px] border-[#EF4444]"
                              ></span>
                            );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="mx-auto w-[100px] sm:w-auto flex-1 lg:w-[180px]">
                    <div className="flex items-center justify-between gap-2 ">
                      <input
                        type="tel"
                        disabled={
                          closed_prediction || match.predicted || predicting
                        }
                        onChange={(e) => {
                          onChangePrediction(
                            match.details.fixture.id.toString(),
                            { home: e.target.value.trim(), keyIndex }
                          );
                        }}
                        defaultValue={
                          match.predictions?.length
                            ? match.predictions[0].prediction
                                .split(":")[0]
                                .trim()
                            : ""
                        }
                        className="h-[30px] lg:h-16 w-8 lg:w-[72px] border-2 outline-none focus:outline-none text-center bg-transparent lg:text-xl text-sm font-bold"
                      />
                      <span className="lg:w-4 lg:h-2 w-1 h-0.5 bg-white" />
                      <input
                        disabled={
                          closed_prediction || match.predicted || predicting
                        }
                        onChange={(e) => {
                          onChangePrediction(
                            match.details.fixture.id.toString(),
                            { away: e.target.value.trim(), keyIndex }
                          );
                        }}
                        defaultValue={
                          match.predictions?.length
                            ? match.predictions[0].prediction
                                .split(":")[1]
                                .trim()
                            : ""
                        }
                        className="h-[30px] lg:h-16 w-8 lg:w-[72px] border-2 outline-none focus:outline-none text-center bg-transparent lg:text-xl text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex-1 lg:w-[250px] flex flex-col items-center gap-3 sm:gap-8">
                    {match.details.teams.away.logo ? (
                      <img
                        src={match.details.teams.away.logo}
                        alt=""
                        className=" lg:flex w-full lg:h-[200px] h-[70px] object-contain"
                      />
                    ) : null}
                    <h2 className="text-center lg:text-4xl text-sm line-clamp-1 lg:line-clamp-2">
                      {match.details.teams.away.name}
                    </h2>

                    {match.details.last_games ? (
                      <div className="flex justify-center items-start gap-2">
                        {match.details.last_games.away?.map((mp, index) => {
                          if (mp === "Win")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-primary-foreground md:border-[3px] border-[2px] border-primary-foreground"
                              ></span>
                            );
                          if (mp === "Draw")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-white md:border-[3px] border-[2px] border-muted-foreground"
                              ></span>
                            );
                          if (mp === "Lose")
                            return (
                              <span
                                key={index}
                                className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-[#EF4444] md:border-[3px] border-[2px] border-[#EF4444]"
                              ></span>
                            );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>

                <h6 className="opacity-60 mt-4">
                  {formatTimeNative(match.details.fixture.date)}
                </h6>
              </div>

              <div className="bg-background/80 rounded-md py-2 px-4 flex items-center gap-3 justify-between">
                {closed_prediction || match.predicted ? (
                  match.details.goals ? (
                    <Button
                      disabled
                      variant="secondary"
                      size="custom"
                      className="flex lg:items-center items-start !w-max lg:px-5 flex-wrap lg:gap-5 text-sm"
                    >
                      <p>
                        Final Result: {match.details.goals.home} -{" "}
                        {match.details.goals.away}
                      </p>
                      {match.predicted ? (
                        <p>
                          Scored Points:{" "}
                          {calculateScore(
                            match.details.goals!,
                            match.predictions[0].prediction
                          )}
                        </p>
                      ) : (
                        <p>Scored Points: 0</p>
                      )}
                    </Button>
                  ) : (
                    <div />
                  )
                ) : (
                  <p className="text-sm text-primary-foreground/60 opacity-75">
                    Make a prediction!
                  </p>
                )}
                {closed_prediction || match.predicted ? (
                  <div className="flex items-center gap-3">
                    <Button
                      disabled={closed_prediction || match.predicted}
                      variant={"secondary"}
                      className="!w-max px-5"
                    >
                      {closed_prediction
                        ? "Prediction Closed"
                        : match.predicted
                        ? "Prediction Applied"
                        : "Apply Prediction"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
}
