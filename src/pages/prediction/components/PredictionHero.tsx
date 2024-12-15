// assets
import PREDICTION_HERO_BOY from "../../../assets/prediction/prediction_hero_boy.svg";
import PREDICTION_HERO_BOY_SMALL from "../../../assets/prediction/prediction_hero_boy_small.svg";

// styles
// import "./styles.css";

const PredictionHero = () => {
  return (
    <div className="w-full lg:px-[90px] px-[16px] mt-[45px]">
      <div className="prediction-hero-container w-full lg:h-[614px] h-fit bg-spl-green-100 rounded-[20px] bg-no-repeat bg-center bg-cover lg:px-[110px] px-[31px] md:py-[51px] py-[14px] relative">
        <div className="w-[157px] lg:w-[551px] md:text-[40px] text-[20px] font-semibold text-spl-white">
          <p className="lg:leading-[92px] leading-[25px] lg:text-[72px] text-[20px] font-black uppercase">
            Your Winning Picks, One Step Ahead
          </p>
        </div>

        <div className="lg:w-[615px] md:w-[300px] w-[175px] md:text-[15px] text-[10px] font-light md:leading-[19px] leading-[12px] text-spl-white uppercase">
          <p>
            Stay ahead of the game with real-time predictions and expert
            insights. Make your move and watch the wins roll in.
          </p>
        </div>

        {/* Small Image for Mobile and Tablet */}
        <img
          src={PREDICTION_HERO_BOY_SMALL}
          alt="prediction-hero-boy-small"
          className="block md:hidden absolute lg:bottom-0 sm:bottom-[-20px] bottom-[-25px] md:bottom-[-40px] right-0 lg:w-[418px] md:w-[200px] w-[149px] lg:h-[674px] md:h-[400px] h-[288px]"
        />

        {/* Large Image for Desktop */}
        <img
          src={PREDICTION_HERO_BOY}
          alt="prediction-hero-boy"
          className="hidden md:block absolute lg:bottom-0 sm:bottom-[-20px] bottom-[-25px] md:bottom-[-40px] right-0 lg:w-[418px] md:w-[200px] w-[149px] lg:h-[674px] md:h-[400px] h-[288px]"
        />
      </div>
    </div>
  );
};

export default PredictionHero;
