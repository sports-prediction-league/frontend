import React, { useEffect, useRef, useState } from "react";

// assets
import DEFAULT_PROFILE from "../../../assets/leaderboard/default_profile.svg";
import BADGE from "../../../assets/leaderboard/badge.svg";
import LEADER_1 from "../../../assets/leaderboard/leader_1.svg";
import LEADER_2 from "../../../assets/leaderboard/leader_2.svg";
import LEADER_3 from "../../../assets/leaderboard/leader_3.svg";

import { useAppSelector } from "src/state/store";
import toast from "react-hot-toast";
import useContractInstance from "src/lib/useContractInstance";
import { cairo } from "starknet";
import { LeaderboardProp } from "src/state/slices/appSlice";
import { apiClient, feltToString } from "src/lib/utils";

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
                    (filter ? filter_result : data).length > 1
                      ? (filter ? filter_result : data)[1]?.user
                          ?.profile_picture
                        ? `data:image/jpeg;base64,${
                            (filter ? filter_result : data)[1]?.user
                              ?.profile_picture
                          }`
                        : ""
                      : ""
                  }
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE;
                  }}
                  className="w-full h-full rounded-full"
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
                  {(filter ? filter_result : data).length > 1
                    ? `${(filter ? filter_result : data)[1]?.user?.username}`
                    : null}
                </p>

                <p className="text-[#009BD6] lg:text-[31px] md:text-[14px] text-[12px] font-bold text-center">
                  {(filter ? filter_result : data).length > 1
                    ? (filter ? filter_result : data)[1]?.totalPoints
                    : null}
                </p>

                {(filter ? filter_result : data).length > 1 ? (
                  <img
                    src={BADGE}
                    alt="ICON"
                    className="mx-auto mt-3 lg:w-[25px] w-[11px] md:w-[18px] md:h-[18px] lg:h-[25px] h-[11px]"
                  />
                ) : null}
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
                        (filter ? filter_result : data).length
                          ? (filter ? filter_result : data)[0]?.user
                              ?.profile_picture
                            ? `data:image/jpeg;base64,${
                                (filter ? filter_result : data)[0]?.user
                                  .profile_picture
                              }`
                            : ""
                          : ""
                      }
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                        (e.target as HTMLImageElement).src = DEFAULT_PROFILE;
                      }}
                      className="rounded-full w-full h-full"
                    />
                    <div className="flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 lg:-bottom-7 -bottom-3">
                      {/* <p className="font-semibold text-[8px] text-spl-white">1</p> */}
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
                      {(filter ? filter_result : data).length
                        ? `${
                            (filter ? filter_result : data)[0]?.user?.username
                          }`
                        : null}
                    </p>

                    <p className="text-[#FFAA00] lg:text-[31px] md:text-[20px] text-[12px] font-bold text-center">
                      {(filter ? filter_result : data).length
                        ? (filter ? filter_result : data)[0]?.totalPoints
                        : null}
                    </p>

                    <img
                      src={BADGE}
                      alt="ICON"
                      className="mx-auto mt-3 lg:w-[35px] w-[15px] md:w-[22px] md:h-[22px] lg:h-[35px] h-[15px]"
                    />
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
                    (filter ? filter_result : data).length > 2
                      ? (filter ? filter_result : data)[2]?.user
                          ?.profile_picture
                        ? `data:image/jpeg;base64,${
                            (filter ? filter_result : data)[2]?.user
                              ?.profile_picture
                          }`
                        : ""
                      : ""
                  }
                  alt=""
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                    (e.target as HTMLImageElement).src = DEFAULT_PROFILE;
                  }}
                  className="w-full h-full rounded"
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
                  {(filter ? filter_result : data).length > 2
                    ? `${(filter ? filter_result : data)[2]?.user?.username}`
                    : null}
                </p>

                <p className="text-[#00D95F] lg:text-[31px] md:text-[14px] text-[12px] font-bold text-center">
                  {(filter ? filter_result : data).length > 2
                    ? (filter ? filter_result : data)[2]?.totalPoints
                    : null}
                </p>

                {(filter ? filter_result : data).length > 2 ? (
                  <img
                    src={BADGE}
                    alt="ICON"
                    className="mx-auto mt-3 lg:w-[25px] w-[11px] md:w-[18px] md:h-[18px] lg:h-[25px] h-[11px]"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardHero;
