
// assets
import PREDICTION_HERO_BOY from "../../../assets/prediction/prediction_hero_boy.svg";

// styles
import "./styles.scss";

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

        <img
          src={PREDICTION_HERO_BOY}
          alt="prediction-hero-boy"
          className="prediction-hero-boy"
        />
      </div>
    </div>
  );
};

export default PredictionHero;
