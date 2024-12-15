// assets
import badge from "../../../assets/leaderboard/badge.svg";

const PointCard = ({ active }: { active: boolean }) => {
  return (
    <div className={`${active ? "point-card-active" : "point-card"}`}>
      <div className="flex gap-[20px] items-center truncate whitespace-nowrap overflow-hidden text-ellipsis">
        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center text-[#858494] text-[14px] font-medium font-[Rubik] border-2 border-[#E4E5E5]">4</div>
        <div className="flex items-center gap-[20px]">
          <div className="md:w-[69px] md:h-[69px] w-[52px] h-[52px] rounded-full bg-[#C4C4C4] relative">
            <img
              src={badge}
              alt="badge"
              className="absolute -bottom-[6px] md:-bottom-2 md:-right-2 -right-1 md:w-[32px] md:h-[32px] w-[24px] h-[24px]"
            />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="lg:text-[24px] sm:text-[20px] text-[15px] font-medium font-[Rubik]">Salva</p>
            <p className="lg:text-[20px] sm:text-[15px] text-[12px] text-[#858494] font-[Rubik]"> 0xe2d3A...Ac72EBea1</p>
            <p className="lg:text-[17px] sm:text-[15px] text-[12px] font-[Rubik] text-[#858494] md:hidden block">
              2,569 points
            </p>
          </div>
        </div>
      </div>
      <div className="md:flex hidden">
        <p className="lg:text-[17px] sm:text-[15px] text-[12px] font-[Rubik] text-[#858494]">2,569 points</p>
      </div>
    </div>
  );
};

export default PointCard;
