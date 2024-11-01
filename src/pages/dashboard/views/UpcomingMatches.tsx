import Button from "src/common/components/Button";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { IoCaretDown } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";
import MakePrediction from "src/common/components/MakePrediction";
import { useAppDispatch, useAppSelector } from "src/state/store";
import {
  MatchData,
  setShowRegisterModal,
  updatePredictionState,
} from "src/state/slices/appSlice";
import { apiClient, groupMatchesByDate, parse_error } from "src/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { TbLoader } from "react-icons/tb";
import useContractInstance from "src/lib/useContractInstance";
import { cairo } from "starknet";

export default function UpcomingMatches() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      const hasOverflow = container.scrollWidth > container.clientWidth;
      setIsOverflowing(hasOverflow); // Update the overflow state
    }
  }, [total_rounds]);

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
                    prediction: `${Number(element.home)}:${Number(
                      element.away
                    )}`,
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const sRef = scrollContainerRef.current;

    if (sRef) {
      sRef.addEventListener("scroll", updateScrollButtons);
      return () => sRef?.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  const round_refs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setActiveRounds(current_round);
    if (current_round === total_rounds) {
      const container = scrollContainerRef.current;
      if (container) {
        setTimeout(() => {
          // Ensure it scrolls to the full end, considering padding or margins
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          container.scrollTo({
            left: maxScrollLeft,
            behavior: "smooth", // Enable smooth scrolling
          });
        }, 200);
      }
    } else {
      if (round_refs.current[current_round - 1]) {
        round_refs.current[current_round - 1]?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
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
              prediction,
            });
            construct.push({
              inputed: true,
              match_id: cairo.felt(key),
              home: cairo.uint256(Number(predictions[key].home.trim())),
              away: cairo.uint256(Number(predictions[key].away.trim())),
            });
          }
        }
      }

      if (!stop) {
        setPredicting(true);
        const contract = getWalletProviderContract();

        if (contract) {
          await contract.make_bulk_prediction(construct);

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

  return (
    <div className="px-2 sm:px-4 lg:px-8 py-6 flex flex-col w-full gap-8">
      {Object.values(predictions).filter(
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
      ) : null}
      <div className="hidden md:flex items-center w-full gap-4">
        {isOverflowing ? (
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <MdOutlineKeyboardDoubleArrowLeft className="size-7 text-[#A3E96C]" />
          </Button>
        ) : null}

        <div
          className="flex-1 flex items-center overflow-x-scroll"
          ref={scrollContainerRef}
        >
          {Array.from({ length: total_rounds }).map((_, index) => (
            <Button
              key={index}
              input_ref={(el) => (round_refs.current[index] = el)}
              variant={activeRounds === index + 1 ? "secondary" : "ghost"}
              className="flex flex-col items-center !gap-0 !h-14 !border-none !hover:text-base !min-w-[221px]"
              onClick={() => {
                if (activeRounds !== index + 1) {
                  setActiveRounds(index + 1);
                  if (index + 1 !== current_round) {
                    fetchRoundsMatches(`${index + 1}`);
                  }
                }
              }}
            >
              <h5 className="!leading-none">ROUND {index + 1}</h5>
            </Button>
          ))}
        </div>

        {isOverflowing ? (
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <MdOutlineKeyboardDoubleArrowRight className="size-7 text-[#A3E96C]" />
          </Button>
        ) : null}
      </div>

      {loading_state ? null : (
        <div className="flex relative md:hidden" ref={dropdownRef}>
          <Button
            onClick={toggleDropdown}
            variant={"secondary"}
            className="flex items-center"
          >
            <h5 className="!leading-none">ROUND {activeRounds}</h5>{" "}
            <IoCaretDown className="size-4 ml-2" />
          </Button>

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
        </div>
      )}

      {loading || loading_state ? (
        <div className="flex items-center justify-center">
          <TbLoader size={40} className="mr-1.5 animate-spin" />
        </div>
      ) : (
        (activeRounds === current_round ? matches : roundsMatches).map(
          (group, _key: number) => (
            <MakePrediction
              predicting={predicting}
              onChangePrediction={onChangePrediction}
              group={group}
              key={_key}
              keyIndex={_key}
            />
          )
        )
      )}

      {(activeRounds === current_round ? matches : roundsMatches).length ===
        0 &&
      !loading &&
      !loading_state ? (
        <p className="text-center">No upcoming match on round {activeRounds}</p>
      ) : null}
    </div>
  );
}
