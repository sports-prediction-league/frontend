import React from "react";

// components
import HeroSection from "../components/HeroSection";
import WhatWeDo from "../components/WhatWeDo";
import HowItWorks from "../components/HowItWorks";
import ScoringSystem from "../components/ScoringSystem";
import UpcomingMatches from "../components/UpcomingMatches";

const Home = () => {
  return (
    <React.Fragment>
      <HeroSection />

      <WhatWeDo />

      <div className="md:mt-[70px] mt-[49px]">
        <HowItWorks />
      </div>

      <div className="md:mt-[222px] mt-[35px]">
        <ScoringSystem />
      </div>

      <UpcomingMatches />
    </React.Fragment>
  );
};

export default Home;
