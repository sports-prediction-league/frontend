import React, { useEffect, useRef, useState } from "react";

// assets
import DEFAULT_PROFILE from "../../../assets/leaderboard/default_profile.svg";
// import BADGE from "../../../assets/leaderboard/badge.svg";
import LEADER_1 from "../../../assets/leaderboard/leader_1.svg";
import LEADER_2 from "../../../assets/leaderboard/leader_2.svg";
import LEADER_3 from "../../../assets/leaderboard/leader_3.svg";

import { useAppSelector } from "src/state/store";
import toast from "react-hot-toast";
import useContractInstance from "src/lib/useContractInstance";
import { cairo } from "starknet";
import { LeaderboardProp } from "src/state/slices/appSlice";
import { apiClient, feltToString, generateAvatarFromAddress } from "src/lib/utils";

interface Props {
  filter: boolean;
  filter_result: LeaderboardProp[];
}
const LeaderBoardHero = ({ filter, filter_result }: Props) => {
  const { leaderboard: data } = useAppSelector((state) => state.app);

  return (
    <div className="w-full px-3 md:px-[90px]">
      <div className="w-full md:h-[500px] h-[299px] p-5 bg-no-repeat bg-cover md:rounded-[36px] rounded-xl flex justify-center items-end leaderboard-hero-container-bg">
        <div className="md:w-[726px] w-full md:h-[258px] h-[142px] bg-white md:rounded-[36px] rounded-xl md:p-5 p-3 grid grid-cols-3">
          <div className="w-full h-full bg-spl-white relative">
            <div className="absolute md:-top-[120px] -top-[60px] left-1/2 transform -translate-x-1/2 md:w-[144px] md:h-[144px] w-[71px] h-[71px] lg:border-[6px] border-[3px] border-[#009BD6] rounded-full">
              <div className="relative">
                <img
                  src={
                    generateAvatarFromAddress(data[1]?.user?.address)
                  }
                  alt=""

                  className="w-full h-full rounded-full bg-[#C9F2E9]"
                />
                <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 lg:-bottom-7 -bottom-3 ">
                  <img
                    src={LEADER_2}
                    alt="ICON"
                    className="h-[21px] w-[21px] lg:w-auto lg:h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="lg:w-[133px] md:w-[100px] w-[57px] break-words mt-3">
                <p className="text-spl-black capitalize lg:text-[15px] md:text-[12px] text-[10px] md:leading-6 font-medium text-center">
                  {data[1]?.user?.username}
                </p>

                {data.length > 1 ? <p className="text-spl-black/50 capitalize md:text-[10px] text-[7px] text-mute font-medium text-center">
                  {
                    `${data[1]?.user?.address?.slice(0, 7)}...${data[1]?.user?.address?.slice(-5)}`
                  }
                </p> : null}

                <p className="text-[#009BD6] lg:text-[31px] md:text-[14px] text-[12px] font-bold text-center">
                  {data[1]?.totalPoints}
                </p>


              </div>
            </div>
          </div>

          <div className="w-full h-full bg-spl-white relative">
            <div className="w-full md:h-[337px] h-[181px] bg-spl-white absolute md:-top-[115px] -top-[70px] left-0 md:rounded-[60px] rounded-[25px] border border-[#00000033]">
              <div className="w-full h-full relative">
                <div className="absolute md:-top-[110px] -top-[50px] left-1/2 transform -translate-x-1/2 md:w-[174px] md:h-[174px] w-[80px] h-[80px] lg:border-[6px] border-[3px] border-[#FFAA00] rounded-full">
                  <div className="relative">
                    <img
                      src={
                        generateAvatarFromAddress(data[0]?.user?.address)
                      }
                      alt=""

                      className="rounded-full bg-[#C9F2E9] w-full h-full"
                    />
                    <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 lg:-bottom-7 -bottom-3">

                      <img
                        src={LEADER_1}
                        alt="ICON"
                        className="h-[21px] w-[21px] lg:w-auto lg:h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div className="lg:w-[210px] md:w-[150px] w-[57px] break-words mt-3">
                    <p className="text-spl-black capitalize lg:text-[25px] md:text-[15px]  text-[10px] md:leading-[36px] font-medium text-center">
                      {
                        data[0]?.user?.username
                      }
                    </p>

                    {data.length > 0 ? <p className="text-spl-black/50 capitalize md:text-[10px] text-[7px] text-mute font-medium text-center">
                      {
                        `${data[0]?.user?.address?.slice(0, 7)}...${data[0]?.user?.address?.slice(-5)}`
                      }
                    </p> : null}

                    <p className="text-[#FFAA00] lg:text-[31px] md:text-[20px] text-[12px] font-bold text-center">
                      {data[0]?.totalPoints}

                    </p>


                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-full bg-spl-white relative">
            <div className="absolute md:-top-[120px] -top-[60px] left-1/2 transform -translate-x-1/2 md:w-[144px] md:h-[144px] w-[71px] h-[71px] lg:border-[6px] border-[3px] border-[#00D95F] rounded-full">
              <div className="relative">
                <img
                  src={
                    generateAvatarFromAddress(data[2]?.user?.address)
                  }
                  alt=""
                  className="w-full h-full rounded-full bg-[#C9F2E9]"
                />
                <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 lg:-bottom-7 -bottom-3 ">
                  <img
                    src={LEADER_3}
                    alt="ICON"
                    className="h-[21px] w-[21px] lg:w-auto lg:h-auto"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="lg:w-[133px] md:w-[100px] w-[57px] break-words mt-3">
                <p className="text-spl-black capitalize lg:text-[15px] md:text-[12px] text-[10px] md:leading-6 font-medium text-center">
                  {data[2]?.user?.username}
                </p>
                {data.length > 2 ? <p className="text-spl-black/50 capitalize md:text-[10px] text-[7px] text-mute font-medium text-center">
                  {
                    `${data[2]?.user?.address?.slice(0, 7)}...${data[2]?.user?.address?.slice(-5)}`
                  }
                </p> : null}

                <p className="text-[#00D95F] lg:text-[31px] md:text-[14px] text-[12px] font-bold text-center">
                  {data[2]?.totalPoints}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardHero;
