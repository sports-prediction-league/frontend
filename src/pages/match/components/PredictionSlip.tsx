import { Loader, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useConnect from "../../../lib/useConnect";
import useContractInstance from "../../../lib/useContractInstance";
import { CONTRACT_ADDRESS, formatUnits, parse_error, parseUnits, TOKEN_DECIMAL } from "../../../lib/utils";
import {
    clearPredictions,
    MatchData,
    removePredictions,
    setPredictionStatus,
} from "../../../state/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { cairo, CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";
interface Props { }
const PredictionSlip = ({ }: Props) => {
    const [slipType, setSlipType] = useState<"Single" | "Multiple">("Single");
    const predicting = useAppSelector(state => state.app.predicting);
    const matches = useAppSelector((state) => state.app.matches.virtual)
        .map((mp) => mp.matches)
        .flat();

    const { connected_address } = useAppSelector((state) => state.app);
    const dispatch = useAppDispatch();
    const [stakeRef, setStake] = useState("0")
    const { getWalletProviderContract, getWalletProviderContractERC20 } = useContractInstance();
    // const [predicting, setPredicting] = useState(false);
    const { handleConnect } = useConnect();
    /**
     * Validates a stake fee input and ensures it can be evenly divided among predictions
     * @param stakeFee The stake fee as a string input
     * @param predictionsLength The number of predictions the stake will be divided across
     * @returns The validated stake as bigint in proper units or 0n if no stake
     * @throws Error if the stake is invalid, below minimum, or can't be evenly divided
     */
    function validateStake(stakeFee: string, predictionsLength: number): {
        totalStake: bigint,
        perPredictionStake: bigint,
    } | undefined {
        const normalizedStake = stakeFee.trim();

        if (!normalizedStake) {
            return {
                totalStake: BigInt(0),
                perPredictionStake: BigInt(0),
            };
        }

        const numericStake = Number(normalizedStake);
        if (isNaN(numericStake) || numericStake < 0) {
            toast.error("Invalid stake amount: must be a valid positive number");
            return;
        }
        if (numericStake === 0) {
            return {
                totalStake: BigInt(0),
                perPredictionStake: BigInt(0),
            };
        }

        if (predictionsLength <= 0) {
            toast.error("Number of predictions must be greater than 0");
            return;
        }

        const perPrediction = numericStake / predictionsLength;

        // Convert total and per prediction to BigInt
        const totalStake = parseUnits(numericStake.toFixed(TOKEN_DECIMAL));
        const perPredictionStake = parseUnits(perPrediction.toFixed(TOKEN_DECIMAL));

        if (perPredictionStake < BigInt(1)) {
            toast.error("Each prediction must be at least 1 unit (wei)");
            return;
        }

        return {
            totalStake,
            perPredictionStake,
        };
    }


    const submit = async () => {
        try {
            if (predicting) return;
            if (!stakeRef) return;
            let account = window.Wallet?.Account;

            const predictions = matches.filter(
                (ft) =>
                    Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
            )
            if (predictions.length < 1) {
                toast.error("No predictions");
                // dispatch(setPredictionStatus(false))

                return;
            }
            const stake = validateStake(stakeRef, predictions.length)
            if (!stake) return;


            dispatch(setPredictionStatus(true))
            const erc20Contract = getWalletProviderContractERC20();

            if (!account) {
                await handleConnect({ approval: Number(stake.totalStake) > 100 ? (Number(stake.totalStake) + Number(parseUnits("100"))).toLocaleString("fullwide", { useGrouping: false }) : undefined })
                account = window.Wallet.Account;
            } else {
                const getAllowance = await erc20Contract!.allowance(connected_address, CONTRACT_ADDRESS!);

                if (Number(getAllowance) < Number(stake.totalStake)) {
                    // console.log({ getAllowance, stake })
                    await handleConnect({ approval: (Number(stake.totalStake) + Number(parseUnits("100"))).toLocaleString("fullwide", { useGrouping: false }) })

                    // await approveToken(((Number(stake.totalStake) - Number(getAllowance)) + 100).toString())
                }
            }

            const balance = await erc20Contract!.balanceOf(connected_address);
            if (Number(balance) < Number(stake.totalStake)) {
                dispatch(setPredictionStatus(false));
                toast.error("INSUFFICIENT_BALANCE");
                return;
            }

            // const getAllowance = await getERC
            // console.log({ stake })

            const pairId = Math.random().toString(36).substring(2, 12);

            const contract = getWalletProviderContract();
            let call;

            if (slipType === "Single") {

                const construct = predictions.map(mp => {
                    return {
                        stake: cairo.uint256(stake.perPredictionStake),
                        prediction_type: new CairoCustomEnum({ Single: { match_id: cairo.felt(mp.details.fixture.id), odd: cairo.felt(mp.prediction!.id!) } }),
                        pair: new CairoOption(CairoOptionVariant.None)
                    }
                })

                call = contract?.populate("make_bulk_prediction", [
                    construct
                ])
            } else {
                const construct = {
                    stake: cairo.uint256(stake.totalStake),
                    prediction_type: predictions.length === 1 ? new CairoCustomEnum({ Single: { match_id: cairo.felt(predictions[0].details.fixture.id), odd: cairo.felt(predictions[0].prediction?.id!) } }) : new CairoCustomEnum({ Multiple: predictions.map(mp => ({ match_id: cairo.felt(mp.details.fixture.id), odd: cairo.felt(mp.prediction?.id!) })) }),
                    pair: new CairoOption(CairoOptionVariant.Some, cairo.felt(pairId))
                }
                call = contract?.populate("make_prediction", [
                    construct
                ])
            }



            if (!call) {
                dispatch(setPredictionStatus(false))

                // setPredicting(false);

                toast.error("Invalid call construct");
                return;
            }
            // await account?.execute([call!]);
            const outsideExecutionPayload = await account?.getOutsideExecutionPayload({ calls: [call] });

            const event = new CustomEvent("MAKE_OUTSIDE_EXECUTION_CALL", {
                detail: {
                    type: "PREDICTION",
                    payload: outsideExecutionPayload
                },
            });
            window.dispatchEvent(event);

            // const response = await apiClient.post(
            //     "/execute",
            //     outsideExecutionPayload
            // );
            // console.log(response.data)
            // if (response.data.success) {
            //     dispatch(submitPrediction());
            // const event = new Event("PREDICTION_MADE");
            // window.dispatchEvent(event);
            //     toast.success("Prediction Successful")

            // } else {
            //     toast.error(
            //         response.data?.message ?? "OOOPPPSSS!! Something went wrong"
            //     );
            // }
            // dispatch(setPredictionStatus(false))

        } catch (error: any) {
            console.log(error);
            toast.error(
                error.response?.data?.message
                    ? parse_error(error.response?.data?.message)
                    : error.message || "An error occurred"
            );
            dispatch(setPredictionStatus(false))

        }
    };

    return (
        <div className="border-2 md:sticky static overflow-y-auto max-h-[calc(100vh-100px)] top-24 dark:border-[#007332] border-[#0000000D] mt-8 rounded-lg p-2">
            <div className="text-white flex items-center justify-center gap-1 my-2">
                <p className="text-sm dark:text-white text-black/80">Prediction Slip</p>
                <div className="bg-[#00644C] w-4 h-4 rounded-full flex justify-center text-[7px] items-center">
                    {
                        matches.filter(
                            (ft) =>
                                Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
                        ).length
                    }
                </div>
            </div>
            <div className="">
                {matches
                    .filter(
                        (ft) =>
                            Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
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
                    (ft) => Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
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
                (ft) => Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
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
                                            ft.details.fixture.date > Date.now() && !ft.predicted
                                    )
                                    .map((mp) =>
                                        Number((mp.details.odds as any)[mp.prediction!.key!].odd)
                                    )
                                    .reduce((acc, num) => acc + num, 0)
                                    .toFixed(2)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 items-center justify-between dark:text-white text-black pilat text-xs font-light">
                            <p>Stake</p>
                            <div className="grid grid-cols-2 items-center -space-x-4">
                                <p className="text-[9px] font-bold m-0">USDC</p>
                                <input
                                    autoFocus
                                    onChange={(e) => {

                                        setStake(e.target.value);

                                    }}
                                    defaultValue={stakeRef}
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
                                <p className="text-[9px]">{validateStake(stakeRef, matches.filter(
                                    (ft) =>
                                        Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
                                ).length) ? slipType === "Single" ? matches
                                    .filter(
                                        (ft) =>
                                            Boolean(ft.prediction) &&
                                            ft.details.fixture.date > Date.now() && !ft.predicted
                                    )
                                    .map((mp) =>
                                        Number((mp.details.odds as any)[mp.prediction!.key!].odd) * Number(formatUnits(validateStake(stakeRef, matches.filter(
                                            (ft) =>
                                                Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
                                        ).length)?.perPredictionStake ?? "0"))
                                    )
                                    .reduce((acc, num) => acc + num, 0)
                                    .toFixed(2) : (matches
                                        .filter(
                                            (ft) =>
                                                Boolean(ft.prediction) &&
                                                ft.details.fixture.date > Date.now() && !ft.predicted
                                        )
                                        .map((mp) =>
                                            Number((mp.details.odds as any)[mp.prediction!.key!].odd)
                                        )
                                        .reduce((acc, num) => acc + num, 0) * Number(formatUnits(validateStake(stakeRef, matches.filter(
                                            (ft) =>
                                                Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
                                        ).length)?.totalStake ?? ""))).toFixed(2) : 0}</p>
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
