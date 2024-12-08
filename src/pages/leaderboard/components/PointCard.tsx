// assets
import badge from "../../../assets/leaderboard/badge.svg";

const PointCard = ({ active }: { active: boolean }) => {
  return (
    <div className={`${active ? "point-card-active" : "point-card"}`}>
      <div className="point-card-left">
        <div className="point-card-number">4</div>
        <div className="point-card-profile">
          <div className="point-card-profile-image">
            <img
              src={badge}
              alt="badge"
              className="absolute -bottom-[6px] md:-bottom-2 md:-right-2 -right-1 md:w-[32px] md:h-[32px] w-[24px] h-[24px]"
            />
          </div>
          <div className="point-card-profile-name">
            <p className="point-card-profile-ussername">Salva</p>
            <p className="point-card-profile-address"> 0xe2d3A...Ac72EBea1</p>
            <p className="point-card-right-point md:hidden block">
              2,569 points
            </p>
          </div>
        </div>
      </div>
      <div className="point-card-right">
        <p className="point-card-right-point">2,569 points</p>
      </div>
    </div>
  );
};

export default PointCard;
