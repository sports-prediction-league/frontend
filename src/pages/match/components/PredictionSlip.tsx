import { Loader, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useConnect from "src/lib/useConnect";
import useContractInstance from "src/lib/useContractInstance";
import { parseUnits } from "src/lib/utils";
import {
    clearPredictions,
    MatchData,
    PredictionOdds,
    removePredictions,
} from "src/state/slices/appSlice";
import { useAppDispatch, useAppSelector } from "src/state/store";
import { cairo, CairoOption, CairoOptionVariant } from "starknet";
interface Props { }
const PredictionSlip = ({ }: Props) => {
    const [slipType, setSlipType] = useState<"Single" | "Multiple">("Multiple");

    const matches = useAppSelector((state) => state.app.matches.virtual)
        .map((mp) => mp.matches)
        .flat();
    const dispatch = useAppDispatch();
    const stakeRef = useRef<HTMLInputElement>(null);
    const { getWalletProviderContract } = useContractInstance();
    const [predicting, setPredicting] = useState(false);
    const { handleConnect } = useConnect();
    function validateStake(stakeFee: string) {
        if (stakeFee.trim().length === 0) {
            return 0
        }

        if (isNaN(Number(stakeFee.trim()))) {
            throw new Error("Invalid input")
        }

        if (Number(stakeFee.trim()) === 0) {
            return 0
        }

        if (Number(parseUnits(stakeFee.trim())) < 1) {
            throw new Error("Minimum stake fee reached");

        }

        return parseUnits(stakeFee.trim());
    }
    const submit = async () => {
        try {
            if (predicting) return;
            if (!stakeRef.current) return;
            const account = window.Wallet?.Account;

            setPredicting(true);
            if (!account) {
                await handleConnect()
            }

            const stake = validateStake(stakeRef.current!.value)

            const pairId = Math.random().toString(36).substring(2, 12);
            const predictions = matches.filter(
                (ft) =>
                    Boolean(ft.prediction) && ft.details.fixture.date > Date.now()
            )


            const construct = predictions.map(mp => {
                return {
                    inputed: true,
                    match_id: cairo.felt(mp.details.fixture.id),
                    id: cairo.felt(mp.prediction!.id!),
                    stake: cairo.uint256(stake),
                    pair: slipType === "Single" && predictions.length > 1 ? new CairoOption(CairoOptionVariant.Some, cairo.felt(pairId)) : new CairoOption(CairoOptionVariant.None)
                }
            })
            const contract = getWalletProviderContract();

            const tx = await contract!.make_bulk_prediction(construct);
            const receipt = await account?.waitForTransaction(tx.transaction_hash);
            console.log(receipt)
            setPredicting(false);
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "An error occurred");
            setPredicting(false);
        }
    };

    return (
        <div className="border-2 sticky overflow-y-auto max-h-[calc(100vh-100px)] top-24 dark:border-[#007332] border-[#0000000D] mt-8 rounded-lg p-2">
            <div className="text-white flex items-center justify-center gap-1 my-2">
                <p className="text-sm dark:text-white text-black/80">Prediction Slip</p>
                <div className="bg-[#00644C] w-4 h-4 rounded-full flex justify-center text-[7px] items-center">
                    {
                        matches.filter(
                            (ft) =>
                                Boolean(ft.prediction) && ft.details.fixture.date > Date.now()
                        ).length
                    }
                </div>
            </div>
            <div className="">
                {matches
                    .filter(
                        (ft) =>
                            Boolean(ft.prediction) && ft.details.fixture.date > Date.now()
                    )
                    .map((mp, index) => {
                        return (
                            <MatchPrediction
                                match={mp}
                                prediction={{ value: mp.prediction?.key }}
                                key={index}
                            />
                        );
                    })}

                {matches.filter(
                    (ft) => Boolean(ft.prediction) && ft.details.fixture.date > Date.now()
                ).length ? (
                    <div className="flex items-center justify-end">
                        <button
                            onClick={() => {
                                dispatch(clearPredictions());
                            }}
                            className="dark:text-[#00CB59] text-[#064F43] text-xs"
                        >
                            clear slip
                        </button>
                    </div>
                ) : null}
            </div>

            {matches.filter(
                (ft) => Boolean(ft.prediction) && ft.details.fixture.date > Date.now()
            ).length ? (
                <div className="border-[0.5px] my-2 space-y-7 border-[#007332]  p-2 rounded-lg mt-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => {
                                setSlipType("Multiple");
                            }}
                            className={
                                slipType === "Multiple"
                                    ? "border border-[#00644C] w-full text-center rounded-lg text-xs px-3 py-2 [box-shadow:0px_6.5px_32.5px_0px_#00CA9A1A] bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)] text-white"
                                    : "w-full dark:text-white text-black text-center text-xs border-b border-b-[#007332] py-2 px-3"
                            }
                        >
                            Multiple
                        </button>
                        <button
                            onClick={() => setSlipType("Single")}
                            className={
                                slipType === "Single"
                                    ? "border border-[#00644C] w-full text-center rounded-lg text-xs px-3 py-2 [box-shadow:0px_6.5px_32.5px_0px_#00CA9A1A] bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)] text-white"
                                    : "w-full dark:text-white text-black text-center text-xs border-b border-b-[#007332] py-2 px-3"
                            }
                        >
                            Single
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between dark:text-white text-black pilat text-xs font-light">
                            <p>Total Odds</p>
                            <p className="text-[10px]">
                                {matches
                                    .filter(
                                        (ft) =>
                                            Boolean(ft.prediction) &&
                                            ft.details.fixture.date > Date.now()
                                    )
                                    .map((mp) =>
                                        Number((mp.details.odds as any)[mp.prediction!.key!].odd)
                                    )
                                    .reduce((acc, num) => acc + num, 0)
                                    .toFixed(1)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 items-center justify-between dark:text-white text-black pilat text-xs font-light">
                            <p>Stake</p>
                            <div className="grid grid-cols-2 items-center -space-x-4">
                                <p className="text-[9px] font-bold m-0">USDC</p>
                                <input
                                    autoFocus
                                    ref={stakeRef}
                                    defaultValue={0}
                                    type="text"
                                    inputMode="decimal"
                                    pattern="^\d*\.?\d*$"
                                    className="border-[0.5px] rounded outline-none py-1 px-2 text-[9px] dark:text-white text-black bg-transparent m-0  dark:border-[#FFFFFF4D] border-[#0000000D] font-medium text-end"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between dark:text-white text-black pilat text-xs font-light">
                            <p>Potential Win</p>
                            <div className="flex items-center gap-2">
                                <p className="text-[9px] font-bold m-0">USDC</p>
                                <p className="text-[9px]">3.4</p>
                            </div>
                        </div>
                    </div>

                    <button disabled={predicting} onClick={submit} className="border border-[#00CB59] w-full gap-1 rounded-lg text-center flex items-center justify-center text-white px-3 py-3 [box-shadow:0px_6.5px_32.5px_0px_#00CA9A1A] bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]">
                        {
                            predicting ? <><Loader size={18} className="animate-spin" /> <p>predicting...</p></> : "Predict"
                        }
                    </button>
                    <p className="text-center text-xs text-[#ED1C24]">
                        Note!! you can stake between 0-10000 usdc
                    </p>
                </div>
            ) : null}
        </div>
    );
};

export default PredictionSlip;

interface MatchPredictionProps {
    prediction: any;
    match: MatchData;
}
const MatchPrediction = ({ prediction, match }: MatchPredictionProps) => {
    const dispatch = useAppDispatch();
    return (
        <div className="border-[0.5px] my-2 space-y-3 border-[#007332] p-2 rounded-lg">
            <div className="flex items-center justify-between text-[9px] dark:text-white text-black">
                <div>
                    <span className="font-light dark:text-white/80 text-black/80">
                        Goals
                    </span>
                    <span className="font-bold">&nbsp;2:2</span>
                </div>
                <button
                    onClick={() => {
                        dispatch(
                            removePredictions([
                                {
                                    date: match.details.fixture.date,
                                    league: match.details.league.league,
                                    match_id: match.details.fixture.id,
                                },
                            ])
                        );
                    }}
                >
                    <X size={15} />
                </button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center dark:text-white/80 text-black/80 text-[10px] gap-1.5 font-extralight">
                    <p>{match.details.teams.home.name}</p>
                    <p>Vs</p>
                    <p>{match.details.teams.away.name}</p>
                </div>
                <p className="dark:text-white text-black text-[10px] font-bold">
                    {prediction?.value}
                </p>
            </div>
        </div>
    );
};
