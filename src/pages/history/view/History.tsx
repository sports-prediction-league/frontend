import { CircleX } from "lucide-react";
import Title from "../../../common/components/tittle/Title";
import PredictionSlip from "../../match/components/PredictionSlip";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import useContractInstance from "../../../lib/useContractInstance";
import { initializePredictionHistory, UserPrediction } from "../../../state/slices/appSlice";
import { checkWin, deserializePredictions, formatDateNative, formatUnits, getTagName } from "../../../lib/utils";
const History = () => {
    const { connected_address, prediction_history } = useAppSelector(state => state.app);
    const { getWalletProviderContract } = useContractInstance()
    const dispatch = useAppDispatch();
    useEffect(() => {
        (async function () {
            try {
                if (!connected_address) return;
                if (prediction_history.length > 0) return;
                const contract = getWalletProviderContract();
                const predictions = await contract!.get_user_predictions(connected_address);
                console.log(predictions)
                dispatch(initializePredictionHistory(deserializePredictions(predictions)));
            } catch (error: any) {

                console.log(error)
            }
        }())
    }, [connected_address])
    return <div>
        <div className="md:my-10 my-5">
            <Title title="Prediction History" />
        </div>

        <div className="xl:px-48 px-3" >
            <div className=" w-full flex flex-col md:gap-[90px] gap-[18px]">
                <div className="grid grid-cols-12 w-full gap-3">
                    <div className="md:col-span-8 col-span-12 w-full">
                        {
                            prediction_history.map((predictions, index) => {
                                const totalStakes = predictions.reduce((sum, obj) => sum + obj.prediction.stake, 0);
                                const totalReturns = predictions.filter(prediction => checkWin(prediction.prediction.odd.Some?.tag ?? "", { home: prediction.match_.home.goals.Some!, away: prediction.match_.away.goals.Some! })).map(mp => mp.prediction.stake * (mp.prediction.odd.Some?.value ? (mp.prediction.odd.Some?.value / 100) : 0)).reduce((sum, obj) => sum + obj, 0).toLocaleString("fullwide", { useGrouping: false })


                                return <div
                                    key={index}
                                    className=" w-full my-8 border-2 dark:border-[#007332] border-[#0000001A]  bg-cover bg-center rounded-lg bg-no-repeat"
                                >
                                    <div className={`dark:bg-[#031614] bg-[#E5EFED] py-3 md:px-10 px-3 dark:text-white/80 text-[#064F43] md:flex-row flex-col rounded-t-lg p-1 text-xs gap-1 md:gap-0  flex items-center md:justify-between justify-center`}>
                                        <div className="flex flex-col justify-center md:items-start items-center">
                                            <p className="text-sm font-light"> Round {predictions[0]?.match_.round.Some ?? ""}</p>

                                        </div>
                                        <div className="">
                                            <p className="md:text-xs text-[10px]">{formatDateNative(new Date(predictions[0]?.match_.timestamp * 1000).toString())}</p>
                                        </div>
                                    </div>

                                    <div className="flex md:items-center items-start md:flex-row flex-col gap-4 justify-between dark:text-white/80 text-[#064F43] font-[450] text-xs px-5 py-7 border-b-[1px] dark:border-b-white/10 border-b-[#0000001A]">
                                        {/* <p>Prediction type: Multiple</p> */}
                                        {/* <p>Total odds: 32.30</p> */}
                                        <p>Total stake: {Number(formatUnits(totalStakes.toString())).toFixed(2)}<span className="text-[7px]">USDC</span></p>
                                        <p>Total return: {Number(formatUnits(totalReturns)).toFixed(2)} <span className="text-[7px]">USDC</span></p>
                                    </div>

                                    <div className="my-10 md:px-14 px-3">



                                        {
                                            predictions.map((prediction, _index) => {
                                                return <Card prediction={prediction} key={_index} />
                                            })
                                        }
                                        {/* <Card /> */}




                                    </div>



                                </div>
                            })
                        }

                    </div>
                    <div className="col-span-4 md:block hidden">
                        <PredictionSlip />

                    </div>
                </div>
            </div>
        </div>
    </div>
}



export default History;

import LEAGUES from "../../../assets/LEAGUES.json";
const Teams = LEAGUES.map(mp => mp.teams).flat()


interface Props {
    prediction: UserPrediction
}

const Card = ({ prediction }: Props) => {
    return <div className="relative p-[1px] my-5 rounded-2xl bg-gradient-to-r from-[rgba(0,203,89,0.1)] via-[rgba(0,115,50,0.1)] to-[rgba(0,203,89,0.1)]">
        <div className="dark:bg-[#031614] bg-white rounded-2xl p-4">
            {prediction.match_.home.goals.None ? <div className="flex justify-end items-center">
                <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-spl-green-100 opacity-75"></span>
                    <span className="relative inline-flex size-1.5 rounded-full bg-spl-green-200"></span>
                </span>
            </div> : null}
            <div className="grid dark:text-white mt-2 text-black md:grid-cols-2 grid-cols-1 items-center md:gap-5 gap-2">
                <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-[Lato] text-lg  line-clamp-1">{Teams.find(fd => fd.id.toString() === prediction.match_.home.id)?.name}</p>
                    <p className="font-bold font-[Lato] text-lg ">{prediction.match_.home.goals.Some !== undefined ? prediction.match_.home.goals.Some : "-"}</p>
                </div>
                <div className="flex items-center md:flex-row gap-2 flex-row-reverse justify-between">
                    <p className="font-bold font-[Lato] text-lg ">{prediction.match_.away.goals.Some !== undefined ? prediction.match_.away.goals.Some : "-"}</p>
                    <p className="font-bold font-[Lato] text-lg line-clamp-1 ">{Teams.find(fd => fd.id.toString() === prediction.match_.away.id)?.name}</p>
                </div>
            </div>

            <div className="flex items-center md:flex-row flex-col md:gap-3 gap-1 text-xs justify-between mt-4 text-black/80 dark:text-white/80">
                <div className="flex items-center justify-center gap-2">
                    <p className="font-medium">You predicted: {prediction.prediction.odd.Some?.tag}({getTagName(prediction.prediction.odd.Some?.tag ?? "")})</p>
                    {prediction.match_.home.goals.Some !== undefined && prediction.match_.away.goals.Some !== undefined ? checkWin(prediction.prediction.odd.Some?.tag ?? "", { home: prediction.match_.home.goals.Some!, away: prediction.match_.away.goals.Some! }) ? <FaRegCircleCheck size={15} color="#00CB59" /> : <CircleX size={17} color="#ED1C24" /> : null}


                </div>
                <div className="flex items-center gap-2">
                    <p>stake: {Number(formatUnits(prediction.prediction.stake.toString())).toFixed(2)}</p>
                    {prediction.prediction.odd.Some ? <p>|</p> : null}
                    {prediction.prediction.odd.Some ? <p>odd: {prediction.prediction.odd.Some?.value / 100}</p> : null}
                </div>
            </div>
        </div>
    </div>
}