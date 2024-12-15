import React from "react";

// assets
import FIRST_POSITION from "../../../assets/leaderboard/first_position.svg";
import SECOND_POSITION from "../../../assets/leaderboard/second_position.svg";
import THIRD_POSITION from "../../../assets/leaderboard/third_position.svg";
import BADGE from "../../../assets/leaderboard/badge.svg";

// styles
// import "./styles.css";

const LeaderBoardHero = () => {
  return (
    <div className="w-full px-[16px] md:px-[90px]">
      <div className="leaderboard-hero-container w-full md:h-[500px] h-[299px] p-5 bg-no-repeat bg-cover rounded-[36px] flex justify-center items-end" style={{backgroundImage: "url(../../../assets/prediction/prdict_hero_bg.svg)"}}>
        <div className="md:w-[726px] w-full md:h-[258px] h-[142px] bg-white rounded-[36px] md:p-5 p-3 grid grid-cols-3">
          <div className="w-full h-full bg-spl-white relative">
            <img
              src={SECOND_POSITION}
              alt=""
              className="absolute md:-top-[120px] -top-[60px] left-1/2 transform -translate-x-1/2 md:w-[144px] md:h-[165px] w-[62px] h-[71px]"
            />
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="md:w-[133px] w-[57px] break-words mt-3">
                <p className="text-spl-black md:text-[15px] text-[10px] md:leading-6 font-medium text-center">
                  0xe2d3A...Ac72EBea1
                </p>

                <p className="text-[#009BD6] md:text-[31px] text-[12px] font-bold text-center">
                  1847
                </p>

                <img
                  src={BADGE}
                  alt="ICON"
                  className="mx-auto mt-3 md:w-[25px] w-[11px] md:h-[25px] h-[11px]"
                />
              </div>
            </div>
          </div>

          <div className="w-full h-full bg-spl-white relative">
            <div className="leaderboard-hero-content-card-item-center w-full md:h-[337px] h-[181px] bg-spl-white absolute md:-top-[115px] -top-[70px] left-0 md:rounded-[60px] rounded-[25px] border border-[#00000033]">
              <div className="w-full h-full relative">
                <img
                  src={FIRST_POSITION}
                  alt=""
                  className="absolute md:-top-[180px] -top-[70px] left-1/2 transform -translate-x-1/2 md:w-[174px] md:h-[261px] w-[74px] h-[111px]"
                />

                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div className="md:w-[210px] w-[57px] break-words mt-3">
                    <p className="text-spl-black md:text-[25px] text-[10px] md:leading-[36px] font-medium text-center">
                      0xe2d3A...Ac72EBea1
                    </p>

                    <p className="text-[#FFAA00] md:text-[31px] text-[12px] font-bold text-center">
                      1847
                    </p>

                    <img
                      src={BADGE}
                      alt="ICON"
                      className="mx-auto mt-3 md:w-[35px] w-[15px] md:h-[35px] h-[15px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-full bg-spl-white relative">
            <img
              src={THIRD_POSITION}
              alt=""
              className="absolute md:-top-[120px] -top-[60px] left-1/2 transform -translate-x-1/2 md:w-[144px] md:h-[165px] w-[62px] h-[71px]"
            />

            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="md:w-[133px] w-[57px] break-words mt-3">
                <p className="text-spl-black md:text-[15px] text-[10px] md:leading-6 font-medium text-center">
                  0xe2d3A...Ac72EBea1
                </p>

                <p className="text-[#00D95F] md:text-[31px] text-[12px] font-bold text-center">
                  1847
                </p>

                <img
                  src={BADGE}
                  alt="ICON"
                  className="mx-auto mt-3 md:w-[25px] w-[11px] md:h-[25px] h-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoardHero;
