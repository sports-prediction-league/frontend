// context
import { useContext } from "react";
import { ThemeContext } from "../../../../context/ThemeContext";

// assets
import HERO_SECTION from "../../../../assets/home/hero_section.svg";
import HERO_SECTION_LIGHT from "../../../../assets/home/hero_section_light.svg";

// styles
import "./styles.scss";

const HeroSection = () => {
  const { mode } = useContext(ThemeContext)!; 
  const imageSrc = mode === 'dark' ? HERO_SECTION : HERO_SECTION_LIGHT; 

  return (
    <div className="hero-section">
      <img src={imageSrc} alt="HERO SECTION" className="w-[98%]"/>
    </div>
  );
};  

export default HeroSection;