import { CircleX } from "lucide-react";
import Title from "../../../common/components/tittle/Title";
import PredictionSlip from "../../match/components/PredictionSlip";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { apiClient, groupMatchesByRound } from "../../../lib/utils";
const History = () => {


    useEffect(() => {
        (async function () {
            try {
                const response = await apiClient.get("/finished-matches");
                if (response.data.success) {
                    const grouped = groupMatchesByRound(response.data.data.matches.virtual)
                    console.log({ grouped })
                }

            } catch (error: any) {

                toast.error(
                    error.response?.data?.message || error.message || "An error occurred"
                );
            }
        }())
    }, [])
    return <div>
        <div className="md:my-10 my-5">
            <Title title="Prediction History" />
        </div>

        <div className="xl:px-48 px-3" >
            <div className=" w-full flex flex-col md:gap-[90px] gap-[18px]">
                <div className="grid grid-cols-12 w-full gap-3">
                    <div className="md:col-span-8 col-span-12 w-full">
                        <div
                            className=" w-full my-8 border-2 dark:border-[#007332] border-[#0000001A]  bg-cover bg-center rounded-lg bg-no-repeat"
                        >
                            <div className={`dark:bg-[#031614] bg-[#E5EFED] py-3 md:px-10 px-3 dark:text-white/80 text-[#064F43] md:flex-row flex-col rounded-t-lg p-1 text-xs gap-1 md:gap-0  flex items-center md:justify-between justify-center`}>
                                <div className="flex flex-col justify-center md:items-start items-center">
                                    <p className="text-sm font-light"> Round 1</p>

                                </div>
                                <div className="">
                                    <p className="md:text-xs text-[10px]">19-jan-2024</p>
                                </div>
                            </div>

                            <div className="flex md:items-center items-start md:flex-row flex-col gap-4 justify-between dark:text-white/80 text-[#064F43] font-[450] text-xs px-5 py-7 border-b-[1px] dark:border-b-white/10 border-b-[#0000001A]">
                                <p>Prediction type: Multiple</p>
                                <p>Total odds: 32.30</p>
                                <p>Total stake: 2eth</p>
                                <p>Total return: 0.00</p>
                            </div>

                            <div className="my-10 md:px-14 px-3">



                                <Card />
                                <Card />




                            </div>


                            {/* {matches.matches.map((match, index) => {
                            return <Match status={status} key={index} match={match} />
                        })} */}

                        </div>

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




const Card = () => {
    return <div className="relative p-[1px] my-5 rounded-2xl bg-gradient-to-r from-[rgba(0,203,89,0.1)] via-[rgba(0,115,50,0.1)] to-[rgba(0,203,89,0.1)]">
        <div className="dark:bg-[#031614] bg-white rounded-2xl p-4">
            <div className="grid dark:text-white text-black md:grid-cols-2 grid-cols-1 items-center md:gap-5 gap-2">
                <div className="flex items-center gap-2 justify-between">
                    <p className="font-bold font-[Lato] text-lg  line-clamp-1">Chelsea</p>
                    <p className="font-bold font-[Lato] text-lg ">2</p>
                </div>
                <div className="flex items-center md:flex-row gap-2 flex-row-reverse justify-between">
                    <p className="font-bold font-[Lato] text-lg ">0</p>
                    <p className="font-bold font-[Lato] text-lg line-clamp-1 ">Leicester C</p>
                </div>
            </div>

            <div className="flex items-center justify-center mt-4 gap-2">
                <p className="text-black/80 dark:text-white/80 text-xs font-medium">You predicted: 1x(home)</p>
                <FaRegCircleCheck size={15} color="#00CB59" />
                <CircleX size={17} color="#ED1C24" />
            </div>
        </div>
    </div>
}