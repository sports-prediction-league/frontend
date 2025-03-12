// assets
import PREDICTION_HERO_BOY from "../../../assets/prediction/prediction_hero_boy.svg";

const MatchHero = () => {
  return (
    <div className="w-full lg:px-[90px] px-[16px] mt-[45px]">
      <div className="w-full md:h-[614px] h-fit bg-spl-green-100 rounded-[20px] bg-no-repeat bg-center bg-cover lg:px-[110px] px-[31px] md:py-[51px] py-[14px] relative prediction-hero-container-bg">
        <div className="w-[157px] md:w-[551px] md:text-[40px] text-[20px] font-semibold text-spl-white">
          <p className="md:leading-[92px] leading-[25px] md:text-[72px] text-[20px] font-black uppercase">
            Your Winning Picks, One Step Ahead
          </p>
        </div>

        <div className="md:w-[615px] w-[175px] md:text-[15px] text-[10px] font-light md:leading-[19px] leading-[12px] text-spl-white uppercase">
          <p>
            Stay ahead of the game with real-time predictions and expert
            insights. Make your move and watch the wins roll in.
          </p>
        </div>

        <img
          src={PREDICTION_HERO_BOY}
          alt="prediction-hero-boy"
          className="absolute bottom-0 right-0 md:w-[418px] w-[179px] md:h-[674px] h-[288px]"
        />
      </div>
    </div>
  );
};

export default MatchHero;
