// assets
import PREDICTION_HERO_BOY from "../../../assets/prediction/prediction_hero_boy.svg";
import PREDICTION_HERO_BOY_SMALL from "../../../assets/prediction/prediction_hero_boy_small.svg";

// styles
import "./styles.css";

const PredictionHero = () => {
  return (
    <div className="prediction-hero">
      <div className="prediction-hero-container">
        <div className="prediction-hero-content">
          <p className="prediction-hero-content-title">
            Your Winning Picks, One Step Ahead
          </p>
        </div>

        <div className="prediction-hero-content-subtitle">
          <p>
            Stay ahead of the game with real-time predictions and expert
            insights. Make your move and watch the wins roll in.
          </p>
        </div>

        {/* Small Image for Mobile and Tablet */}
        <img
          src={PREDICTION_HERO_BOY_SMALL}
          alt="prediction-hero-boy-small"
          className="block md:hidden prediction-hero-boy"
        />

        {/* Large Image for Desktop */}
        <img
          src={PREDICTION_HERO_BOY}
          alt="prediction-hero-boy"
          className="hidden md:block prediction-hero-boy"
        />
      </div>
    </div>
  );
};

export default PredictionHero;
