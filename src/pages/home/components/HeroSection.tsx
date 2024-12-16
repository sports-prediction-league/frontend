// context
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

// assets
import HERO_SECTION from "../../../assets/home/hero_section.svg";
import HERO_SECTION_LIGHT from "../../../assets/home/hero_section_light.svg";

const HeroSection = () => {
  const { mode } = useContext(ThemeContext)!;
  const imageSrc = mode === "dark" ? HERO_SECTION : HERO_SECTION_LIGHT;

  return (
    <div className="w-full flex md:mt-[53px] mt-[15px] md:px-0 px-[16px]">
      <img src={imageSrc} alt="HERO SECTION" className="w-full" />
    </div>
  );
};

export default HeroSection;
