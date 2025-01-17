import React, { useEffect, useRef, useState } from "react";

// components
import PredictionHero from "../components/PredictionHero";
import PredictionCard from "../../../common/components/predictionCard/PredictionCard";
import { TbLoader } from "react-icons/tb";

// assets
import FAV_ICON from "../../../assets/prediction/fav_icon.svg";
import { useAppDispatch, useAppSelector } from "src/state/store";
import useContractInstance from "src/lib/useContractInstance";
import {
  apiClient,
  formatDateNative,
  groupMatchesByDate,
  parse_error,
  parseUnits,
  TOKEN_DECIMAL,
} from "src/lib/utils";
import {
  MatchData,
  setShowRegisterModal,
  updatePredictionState,
} from "src/state/slices/appSlice";
import { cairo } from "starknet";
import axios from "axios";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { Modal } from "antd";

const Prediction = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    total_rounds,
    current_round,
    matches,
    loading_state,
    connected_address,
    is_registered,
  } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { getWalletProviderContract } = useContractInstance();
  const [activeRounds, setActiveRounds] = useState(current_round);
  const [predicting, setPredicting] = useState(false);
  const [predictions, setPredictions] = useState<Record<string, any>>({});

  const onChangePrediction = (match_id: string, value: any) => {
    setPredictions({
      ...predictions,
      [match_id]: {
        ...predictions[match_id],
        ...value,
      },
    });
  };

  const [roundsMatches, setRoundsMatches] = useState<MatchData[][]>([]);

  let controller: AbortController | null = null;

  const fetchRoundsMatches = async (round: string) => {
    try {
      if (loading && controller) {
        controller.abort();
      }
      const contract = getWalletProviderContract();

      if (!contract) return;
      setLoading(true);

      controller = new AbortController();
      const response = await apiClient.get(`/matches?round=${round}`, {
        signal: controller.signal,
      });
      if (response.data.success) {
        let response_data: MatchData[] =
          response.data?.data?.matches?.rows ?? [];
        if (contract) {
          const user_predictions: {
            match_id: string;
            home: number;
            away: number;
            stake: string;
          }[] = await contract!.get_user_predictions(
            cairo.uint256(Number(round.trim())),
            connected_address
          );

          for (let i = 0; i < user_predictions.length; i++) {
            const element = user_predictions[i];
            const index = response_data.findIndex(
              (fd: MatchData) =>
                fd.details.fixture.id.toString() ===
                element.match_id?.toString()
            );
            if (index !== -1) {
              response_data[index] = {
                ...response_data[index],
                predicted: true,
                predictions: [
                  {
                    prediction: {
                      prediction: `${Number(element.home)}:${Number(
                        element.away
                      )}`,
                      stake: element.stake,
                    },
                  },
                ],
              };
            }
          }
        }

        const groupedMatches = groupMatchesByDate(response_data);

        setRoundsMatches(groupedMatches);
      }

      controller = null;
    } catch (error) {
      if (axios.isCancel(error)) {
        /// TODO: NOTHING
      } else {
        toast.error("OOOPPPSS!! Something went wrong"); // Handle other errors
      }

      controller = null;
    }

    setLoading(false);
  };

  useEffect(() => {
    setActiveRounds(current_round);
  }, [current_round]);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleBulkPredict = async () => {
    try {
      if (predicting) return;
      if (!window.Wallet?.IsConnected) {
        toast.error("Wallet not connected!");
        return;
      }

      if (
        !Object.values(predictions).filter(
          (ft) => Boolean(ft.home) && Boolean(ft.away)
        ).length
      ) {
        toast.error("Enter match scores");
        return;
      }
      if (!is_registered) {
        dispatch(setShowRegisterModal(true));
        return;
      }
      const keys = Object.keys(predictions);
      let construct = [];
      let dispatch_data = [];
      let stop = false;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (predictions[key].stake) {
          if (isNaN(Number(predictions[key].stake))) {
            toast.error("Invalid stake value!");
            return;
          }
        }
        if (predictions[key].home !== "" || predictions[key].away !== "") {
          if (predictions[key].home === "" || predictions[key].away === "") {
            toast.error("Enter scores for both teams");
            stop = true;
            break;
          } else {
            if (isNaN(Number(predictions[key].home?.trim()))) {
              toast.error("Invalid fields");
              stop = true;
              break;
            }
            if (isNaN(Number(predictions[key].away?.trim()))) {
              toast.error("Invalid fields");
              stop = true;
              break;
            }
            const prediction = `${predictions[key].home.trim()}:${predictions[
              key
            ].away.trim()}`;

            dispatch_data.push({
              matchId: key,
              keyIndex: predictions[key].keyIndex,
              prediction: {
                prediction,
                stake: predictions[key]["stake"] ?? 0,
              },
            });
            construct.push({
              inputed: true,
              match_id: cairo.felt(key),
              home: cairo.uint256(Number(predictions[key].home.trim())),
              away: cairo.uint256(Number(predictions[key].away.trim())),
              stake: predictions[key]["stake"]
                ? cairo.uint256(
                    Number(parseUnits(predictions[key]["stake"], TOKEN_DECIMAL))
                  )
                : cairo.uint256(0),
            });
          }
        }
      }

      if (!stop) {
        setPredicting(true);
        const contract = getWalletProviderContract();

        if (contract) {
          await contract!.make_bulk_prediction(construct);

          dispatch(updatePredictionState(dispatch_data));

          if (activeRounds !== current_round) {
            let new_data = roundsMatches;

            for (let i = 0; i < dispatch_data.length; i++) {
              const element = dispatch_data[i];

              const new_indexed_data = roundsMatches[element.keyIndex].map(
                (mp) => {
                  if (mp.details.fixture.id.toString() === element.matchId) {
                    return {
                      ...mp,
                      predicted: true,
                      predictions: [{ prediction: element.prediction }],
                    };
                  }
                  return mp;
                }
              );
              new_data[element.keyIndex] = new_indexed_data;
            }
            setRoundsMatches(new_data);
          }
          setPredictions({});
          toast.success("Prediction Successful!");
        }

        setPredicting(false);
      }
    } catch (error: any) {
      toast.error(parse_error(error?.message));
      setPredicting(false);
      console.log(error);
    }
  };

  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isWidgetActive, setWidgetActive] = useState(false);
  const [matchId, setMatchId] = useState<number | null>(null);

  useEffect(() => {
    if (!isWidgetActive) {
      // const loadedScript = document.querySelector(
      //   'script[src="https://widgets.sir.sportradar.com/sportradar/widgetloader"]'
      // );
      // if (loadedScript) {
      //   document.body.removeChild(loadedScript);
      // }
      return;
    }

    const scriptId = "sportradar-widget-loader";

    // Check if the script is already added
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://widgets.sir.sportradar.com/sportradar/widgetloader";
      script.async = true;
      script.setAttribute("n", "SIR");
      document.body.appendChild(script);

      script.onload = () => {
        initializeWidget();
      };
    } else {
      initializeWidget();
    }

    function initializeWidget() {
      if (window.SIR && widgetContainerRef.current && matchId) {
        console.log("whhi");
        window.SIR(
          "addWidget",
          `.widget-container-${matchId}`,
          "match.lmtPlus",
          {
            matchId: matchId,
            scoreboard: "extended",
          }
        );
      }
    }

    return () => {
      // Cleanup: Clear widget container
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = "";
      }
      const loadedScript = document.querySelector(
        'script[src="https://widgets.sir.sportradar.com/sportradar/widgetloader"]'
      );
      if (loadedScript) {
        document.body.removeChild(loadedScript);
      }
    };
  }, [isWidgetActive]);
  const toggleWidget = () => {
    // let status;
    setWidgetActive((prev) => !prev);

    // if (status) {
    //   setMatchId(null);
    // }
  };

  return (
    <React.Fragment>
      <PredictionHero />
      {/* {Object.values(predictions).filter(
        (ft) => Boolean(ft.home) && Boolean(ft.away)
      ).length ? (
        <button
          disabled={predicting}
          onClick={handleBulkPredict}
          className="!bg-primary-foreground text-black shadow-md shadow-white fixed bottom-10 right-10 rounded-full py-3 px-5"
        >
          {predicting ? (
            <TbLoader size={22} color="black" className="mr-1.5 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      ) : null} */}

      <Modal
        className="text-white"
        open={isWidgetActive}
        onCancel={toggleWidget}
        destroyOnClose
        styles={{
          content: {
            background: "#042822",
            paddingLeft: "0",
            paddingRight: "0",
          },
          header: { background: "#042822", color: "white" },
        }}
        // width={"100%"}
        // closeIcon={<IoClose color="white" />}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <div
          ref={widgetContainerRef}
          className={`sr-widget widget-container-${matchId}`}
          style={{
            // maxWidth: "620px",
            width: "100%",
            border: "1px solid rgba(0, 0, 0, 0.12)",
          }}
        ></div>
      </Modal>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={toggleWidget}
          style={{ padding: "8px 16px", fontSize: "16px" }}
        >
          {isWidgetActive ? "Remove Widget" : "Load Widget"}
        </button>
        {isWidgetActive && (
          <div
            ref={widgetContainerRef}
            className="sr-widget sr-widget-1"
            style={{
              maxWidth: "620px",
              width: "100%",
              border: "1px solid rgba(0, 0, 0, 0.12)",
            }}
          ></div>
        )}
      </div> */}
      {isOpen && (
        <div className="absolute z-50 right-0 w-48 mt-2 h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {Array.from({ length: total_rounds }).map((_, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  if (activeRounds !== index + 1) {
                    setActiveRounds(index + 1);
                    if (index + 1 !== current_round) {
                      fetchRoundsMatches(`${index + 1}`);
                    }
                    setIsOpen(false);
                  }
                }}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left font-light"
              >
                Round {index + 1}
              </button>
            );
          })}
        </div>
      )}

      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px] lg:px-[90px] mt-[45px]">
        {loading || loading_state ? (
          <div className="flex items-center justify-center">
            <TbLoader
              size={40}
              className="text-black dark:text-white mr-1.5 animate-spin"
            />
          </div>
        ) : (
          (activeRounds === current_round ? matches : roundsMatches).map(
            (group, key) => {
              return (
                <div
                  key={key}
                  className="w-full flex flex-col md:gap-[71px] gap-[19px]"
                >
                  <div className="w-full px-3 flex justify-between items-center">
                    {key === 0 ? (
                      <div
                        onClick={toggleDropdown}
                        className="px-3 py-1 rounded dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-[#0000000D] flex items-center gap-2 justify-center"
                      >
                        <p className="dark:text-spl-white text-spl-black lg:text-xl text-sm font-[Lato]  font-bold">
                          Round {activeRounds}
                        </p>

                        <img
                          src={FAV_ICON}
                          alt="ICON"
                          className="lg:w-[20px] w-3 lg:h-[20px] h-3"
                        />
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="px-3 py-1 rounded-lg dark:bg-spl-green-100 bg-spl-white dark:border-none border border-spl-[#0000000D] flex items-center justify-center">
                      <p className="dark:text-spl-white text-spl-black  font-[Lato] lg:text-xl text-sm  font-bold">
                        {formatDateNative(group[0]?.details.fixture.date)}
                      </p>
                    </div>
                  </div>

                  {group.map((match, _key) => {
                    return (
                      <div
                        key={_key}
                        className="w-full flex flex-col md:gap-[63px] gap-[24px] justify-center items-center"
                      >
                        <PredictionCard
                          predicting={predicting}
                          keyIndex={_key}
                          onChangePrediction={onChangePrediction}
                          match={match}
                          onStakeClick={handleBulkPredict}
                          onSeeStatsClick={() => {
                            setMatchId(Number(match.details.fixture.id));
                            setWidgetActive(true);
                          }}
                          onExplorePredictionsClick={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            }
          )
        )}
      </div>
    </React.Fragment>
  );
};

export default Prediction;
