import React, { useEffect, useRef, useState } from "react";

// components
import MatchHero from "../components/MatchHero";
import MatchCard from "../../../common/components/MatchCard/MatchCard";

// assets
import FAV_ICON from "../../../assets/prediction/fav_icon.svg";
import { useAppDispatch, useAppSelector } from "src/state/store";
import useContractInstance from "src/lib/useContractInstance";
import {
  apiClient,
  CONTRACT_ADDRESS,
  formatDateNative,
  groupMatchesByDate,
  parse_error,
  parseUnits,
  TOKEN_ADDRESS,
  TOKEN_DECIMAL,
} from "src/lib/utils";
import {
  ConnectCalldata,
  MatchData,
  setShowRegisterModal,
  // updatePredictionState,
} from "src/state/slices/appSlice";
import { cairo, WalletAccount } from "starknet";
import axios from "axios";
import toast from "react-hot-toast";
import useConnect from "src/lib/useConnect";
import ComingSoonModal from "src/common/components/modal/ComingSoonModal";
import HASHED_BACKGROUND from "../../../assets/scoringSystem/hashed_background.svg";
import Button from "src/common/components/button/Button";
import PredictionSlip from "../components/PredictionSlip";
import { Circle, X } from "lucide-react";
import { Modal } from "antd";



const Leagues = [
  {
    id: 1,
    league: "Premier League",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    "id": 2,
    "league": "La Liga",
    "country": "Spain",
    flag: "🇪🇸"
  },
  {
    "id": 3,
    "league": "Serie A",
    "country": "Italy",
    flag: "🇮🇹"
  },
  {
    "id": 4,
    "league": "Bundesliga",
    "country": "Germany",
    flag: "🇩🇪"
  },
  {
    "id": 5,
    "league": "Ligue 1",
    "country": "France",
    flag: "🇫🇷"
  }
]

const Match = () => {
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
  const { getWalletProviderContract, getWalletProviderContractERC20 } =
    useContractInstance();
  const [activeRounds, setActiveRounds] = useState(current_round);
  const [predicting, setPredicting] = useState<any>(false);
  const [current_league, set_current_league] = useState<number>(0);
  // const [predictions, setPredictions] = useState<Record<string, any>>({});
  const { handleConnect, handleDisconnect } = useConnect();

  // const onChangePrediction = (match_id: string, value: string) => {

  //   if (predictions[match_id]) {
  //     setPredictions({
  //       ...predictions,
  //       [match_id]: predictions[match_id].value === value ? undefined : { value }
  //     })
  //     return;
  //   }
  //   setPredictions({
  //     ...predictions,
  //     [match_id]: {
  //       value
  //     },
  //   });
  // };

  const [roundsMatches, setRoundsMatches] = useState<MatchData[][]>([]);

  let controller: AbortController | null = null;

  // const fetchRoundsMatches = async (round: string) => {
  //   try {
  //     if (loading && controller) {
  //       controller.abort();
  //     }
  //     const contract = getWalletProviderContract();

  //     if (!contract) return;
  //     setLoading(true);

  //     controller = new AbortController();
  //     const response = await apiClient.get(`/matches?round=${round}`, {
  //       signal: controller.signal,
  //     });
  //     if (response.data.success) {
  //       let response_data: MatchData[] =
  //         response.data?.data?.matches?.rows ?? [];
  //       if (contract) {
  //         const user_predictions: {
  //           match_id: string;
  //           home: number;
  //           away: number;
  //           stake: string;
  //         }[] = await contract!.get_user_predictions(
  //           cairo.uint256(Number(round.trim())),
  //           connected_address
  //         );

  //         for (let i = 0; i < user_predictions.length; i++) {
  //           const element = user_predictions[i];
  //           const index = response_data.findIndex(
  //             (fd: MatchData) =>
  //               fd.details.fixture.id.toString() ===
  //               element.match_id?.toString()
  //           );
  //           if (index !== -1) {
  //             response_data[index] = {
  //               ...response_data[index],
  //               predicted: true,
  //               predictions: [
  //                 {
  //                   prediction: {
  //                     prediction: `${Number(element.home)}:${Number(
  //                       element.away
  //                     )}`,
  //                     stake: element.stake,
  //                   },
  //                 },
  //               ],
  //             };
  //           }
  //         }
  //       }

  //       const groupedMatches = groupMatchesByDate(response_data);

  //       setRoundsMatches(groupedMatches);
  //     }

  //     controller = null;
  //   } catch (error) {
  //     if (axios.isCancel(error)) {
  //       /// TODO: NOTHING
  //     } else {
  //       toast.error("OOOPPPSS!! Something went wrong"); // Handle other errors
  //     }

  //     controller = null;
  //   }

  //   setLoading(false);
  // };

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

  const [showSlipIcon, setShowSlipIcon] = useState(false);

  useEffect(() => {
    // console.log("changed", matches.virtual.flat())
    if (matches.virtual.map(mp => mp.matches).flat()
      .filter(
        (ft) =>
          Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
      ).length > 0) {
      setShowSlipIcon(true)
    } else {
      setShowSlipIcon(false)
      set_slip_open(false);
    }
  }, [matches])

  // const handleBulkPredict = async (
  //   _pred?: Record<string, any>,
  //   _key?: string
  // ) => {
  //   try {
  //     if (predicting) return;
  //     if (!window.Wallet?.IsConnected) {
  //       toast.error("Wallet not connected!");
  //       return;
  //     }

  //     const _predictions =
  //       _pred ?? _key ? { [_key!]: predictions[_key!] } : predictions;

  //     if (
  //       !Object.values(_predictions).filter(
  //         (ft) => Boolean(ft?.home) && Boolean(ft?.away)
  //       ).length
  //     ) {
  //       toast.error("Enter match scores");
  //       return;
  //     }
  //     if (!is_registered) {
  //       dispatch(setShowRegisterModal(true));
  //       return;
  //     }
  //     const keys = Object.keys(_predictions);
  //     let construct = [];
  //     let dispatch_data = [];
  //     let stop = false;
  //     let predicting_keys: any = {};

  //     for (let i = 0; i < keys.length; i++) {
  //       const key = keys[i];
  //       if (_predictions[key].stake) {
  //         if (isNaN(Number(_predictions[key].stake))) {
  //           toast.error("Invalid stake value!");
  //           return;
  //         }
  //       }
  //       if (_predictions[key].home !== "" || _predictions[key].away !== "") {
  //         if (_predictions[key].home === "" || _predictions[key].away === "") {
  //           toast.error("Enter scores for both teams");
  //           stop = true;
  //           break;
  //         } else {
  //           if (isNaN(Number(_predictions[key].home?.trim()))) {
  //             toast.error("Invalid fields");
  //             stop = true;
  //             break;
  //           }
  //           if (isNaN(Number(_predictions[key].away?.trim()))) {
  //             toast.error("Invalid fields");
  //             stop = true;
  //             break;
  //           }
  //           const prediction = `${_predictions[key].home.trim()}:${_predictions[
  //             key
  //           ].away.trim()}`;

  //           predicting_keys[key] = true;

  //           dispatch_data.push({
  //             matchId: key,
  //             keyIndex: _predictions[key].keyIndex,
  //             prediction: {
  //               prediction,
  //               stake: _predictions[key]["stake"] ?? 0,
  //             },
  //           });
  //           construct.push({
  //             inputed: true,
  //             match_id: cairo.felt(key),
  //             home: cairo.uint256(Number(_predictions[key].home.trim())),
  //             away: cairo.uint256(Number(_predictions[key].away.trim())),
  //             stake: _predictions[key]["stake"]
  //               ? Number(parseUnits(_predictions[key]["stake"], TOKEN_DECIMAL))
  //               : 0,
  //           });
  //         }
  //       }
  //     }

  //     if (!stop) {
  //       setPredicting(predicting_keys);
  //       const total_stake = construct.reduce(
  //         (total, num) => total + num.stake,
  //         0
  //       );
  //       const erc20_contract = getWalletProviderContractERC20();
  //       const check_allowance = await erc20_contract!.allowance(
  //         connected_address,
  //         CONTRACT_ADDRESS
  //       );
  //       if (Number(total_stake > Number(check_allowance))) {
  //         await handleDisconnect();
  //         const return_calldata: ConnectCalldata = {
  //           type: "prediction",
  //           data: predictions,
  //         };
  //         await handleConnect(
  //           [
  //             {
  //               tokenAddress: TOKEN_ADDRESS,
  //               amount: (
  //                 total_stake + Number(parseUnits("100", TOKEN_DECIMAL))
  //               ).toString(),
  //               spender: CONTRACT_ADDRESS,
  //             },
  //           ],

  //           JSON.stringify(return_calldata)
  //         );
  //       }
  //       const contract = getWalletProviderContract();

  //       if (contract) {
  //         const call = contract!.populate("make_bulk_prediction", [construct]);

  //         const account = window.Wallet.Account as WalletAccount;

  //         const outsideExecutionPayload =
  //           await account.getOutsideExecutionPayload({
  //             calls: [call],
  //           });

  //         if (!outsideExecutionPayload) {
  //           setPredicting(false);
  //           toast.error("error processing outside payload");
  //           return;
  //         }

  //         const response = await apiClient.post(
  //           "/execute",
  //           outsideExecutionPayload
  //         );

  //         if (response.data.success) {
  //           dispatch(updatePredictionState(dispatch_data));

  //           if (activeRounds !== current_round) {
  //             let new_data = roundsMatches;

  //             for (let i = 0; i < dispatch_data.length; i++) {
  //               const element = dispatch_data[i];

  //               const new_indexed_data = roundsMatches[element.keyIndex].map(
  //                 (mp) => {
  //                   if (mp.details.fixture.id.toString() === element.matchId) {
  //                     return {
  //                       ...mp,
  //                       predicted: true,
  //                       predictions: [
  //                         {
  //                           prediction: element.prediction,
  //                           stake: element.prediction.stake,
  //                         },
  //                       ],
  //                     };
  //                   }
  //                   return mp;
  //                 }
  //               );
  //               new_data[element.keyIndex] = new_indexed_data;
  //             }
  //             setRoundsMatches(new_data);
  //           }
  //           if (!_pred) {
  //             setPredictions({});
  //           }
  //           toast.success("Prediction Successful!");
  //         } else {
  //           toast.error(
  //             response.data?.message ?? "OOOPPPSSS!! Something went wrong"
  //           );
  //         }
  //       }

  //       setPredicting(false);
  //     }
  //     dispatch(setCalldata(null));
  //   } catch (error: any) {
  //     dispatch(setCalldata(null));
  //     toast.error(parse_error(error?.message));
  //     setPredicting(false);
  //     console.log(error);
  //   }
  // };



  const [open_modal, set_open_modal] = useState(false);
  const [slip_open, set_slip_open] = useState(false);


  return (
    <div className="xl:px-48 px-3" >
      <MatchHero />
      <Modal

        open={slip_open}
        onCancel={() => {
          set_slip_open(false);
        }}

        styles={{
          content: {
            background: "#042822",
            border: "none",
            borderRadius: "10px",
            padding: "15px 2px"
          },
          // header: { background: "white", color: "white", padding: "2px" },

        }}
        destroyOnClose

        closeIcon={<X color="white" />}

        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}

      >
        <div className="p-2">
          <PredictionSlip />
        </div>
      </Modal>


      <ComingSoonModal
        open_modal={open_modal}
        onClose={() => {
          set_open_modal(false);
        }}
      />

      {/* {isOpen && (
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
      )} */}


      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px] mt-5">

        <div
          className={` w-full overflow-x-auto bg-spl-green-300 bg-cover bg-center px-3 py-3 rounded-lg bg-no-repeat flex items-center justify-between gap-2`}
          style={{ backgroundImage: `url(${HASHED_BACKGROUND})` }}
        >

          <button onClick={() => set_current_league(0)} className={`[box-shadow:0px_4px_4px_0px_#00000040] whitespace-nowrap w-full ${current_league === 0 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === 0 ? "text-spl-white" : "text-black"} font-light py-1.5 px-4 rounded-lg pilat`}>All Matches</button>
          <button onClick={() => set_current_league(1)} className={`[box-shadow:0px_4px_4px_0px_#00000040] whitespace-nowrap w-full ${current_league === 1 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === 1 ? "text-spl-white" : "text-black"} font-light py-1.5 px-4 rounded-lg pilat`}>Upcoming Matches</button>
          {
            Leagues.map((league, index) => {
              return <button onClick={() => set_current_league(index + 2)} key={index + 2} className={`w-full [box-shadow:0px_4px_4px_0px_#00000040] ${current_league === index + 2 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === index + 2 ? "text-spl-white" : "text-black"} font-light py-1 px-4 rounded-lg pilat flex items-center gap-1 justify-center`}><span className="text-sm">{league.flag}</span> <span>{league.country}</span></button>
            })
          }
        </div>
      </div>



      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px]">
        <div className="grid grid-cols-12 w-full gap-3">
          <div className="md:col-span-8 col-span-12 w-full">

            {(current_league < 2 ? matches.virtual : matches.virtual.filter(ft => ft.league.toLowerCase() === Leagues[current_league - 2].league.toLowerCase())).map((match, index) => {
              return <MatchCard key={index} matches={match} active={Date.now() >= new Date(match.date).getTime()} />
            })}
          </div>
          <div className="col-span-4 md:block hidden">
            <PredictionSlip />

          </div>
        </div>
      </div>

      {
        showSlipIcon ?
          <div className="md:hidden fixed bottom-10 right-10">
            <button onClick={() => {
              set_slip_open(!slip_open)
            }} className="bg-spl-green-100 p-3 shadow-xl rounded-full"><Circle color="white" /></button>

          </div>
          : null
      }
    </div>
  );
};

export default Match;
