// assets
import { LeaderboardProp } from "src/state/slices/appSlice";
import badge from "../../../assets/leaderboard/badge.svg";
import DEFAULT_PROFILE from "../../../assets/leaderboard/default_profile.svg";

const PointCard = ({
  active,
  data,
  index,
}: {
  active: boolean;
  data: LeaderboardProp;
  index: number;
}) => {
  return (
    <div
      className={`${
        active
          ? "lg:w-[831px] md:w-[590px] w-full bg-spl-green-500 rounded-2xl md:rounded-[32px] px-2 py-1 md:py-7 md:px-[30px] border border-[#E4E5E5] flex justify-between items-center text-spl-white"
          : "lg:w-[831px] w-full md:w-[590px]  bg-spl-white rounded-2xl md:rounded-[32px] px-2 py-1 md:px-[30px] md:py-7 border border-[#E4E5E5] flex justify-between items-center"
      }`}
    >
      <div className="flex gap-[20px] items-center">
        <div className="md:w-[30px] w-[20px] md:h-[30px] h-[20px] rounded-full flex justify-center items-center text-[#858494] md:text-[14px] text-xs font-medium font-[Rubik] md:border-2 border-[1px] border-[#E4E5E5]">
          {index + 1}
        </div>
        <div className="flex items-center gap-[20px]">
          <div
            style={
              data?.user?.profile_picture
                ? {
                    background: `url(data:image/jpeg;base64,${data?.user?.profile_picture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined /*{
                    background: `url(${DEFAULT_PROFILE})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }*/
            }
            className="md:w-[69px] md:h-[69px] w-[42px] h-[42px] rounded-full bg-[#C4C4C4] relative"
          >
            <img
              src={badge}
              alt="badge"
              className="absolute -bottom-[3px] md:bottom-1 md:-right-1 -right-0.5 md:w-[22px] md:h-[22px] w-[14px] h-[14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="md:text-[24px] capitalize  font-medium font-[Rubik]">
              {data.user?.username}
            </p>
            <p className="md:text-[20px] text-sm text-[#858494] font-[Rubik]">
              {" "}
              {`${data.user?.address?.slice(
                0,
                7
              )}...${data?.user?.address?.slice(-10)}`}
            </p>
            <p className="text-sm font-[Rubik] text-[#858494] md:hidden block">
              {data.totalPoints?.toLocaleString()} points
            </p>
          </div>
        </div>
      </div>
      <div className="md:flex hidden">
        <p className="text-[17px] font-[Rubik] text-[#858494]">
          {data.totalPoints?.toLocaleString()} points
        </p>
      </div>
    </div>
  );
};

export default PointCard;
