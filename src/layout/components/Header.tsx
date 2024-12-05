// context
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";

// components
import Button from "../../common/components/button/Button";

// assets
import SPL_LOGO from "../../assets/header/spl_logo.svg";
import DARK_MODE from "../../assets/header/dark_mode.svg";
import LIGHT_MODE from "../../assets/header/light_mode.svg";

// styles
import "./styles.scss";
import { ThemeContext } from "../../context/ThemeContext";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const { mode, toggleMode } = useContext(ThemeContext)!;
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="header-container">
      <div className="header-content">
        <img src={SPL_LOGO} alt="SPL LOGO" />
        
        <div className="hamburger-icon md:hidden">
          <FaBars onClick={toggleDrawer} className="text-white"/>
        </div>

        <div className="connect-wallet-btn md:flex items-center gap-[15px] hidden">
          <Button 
            text="Upcoming Matches" 
            onClick={() => handleNavigation('/prediction')} 
            background={location.pathname === '/prediction' ? undefined : "#FFFFFF"} 
            textColor={location.pathname === '/prediction' ? undefined : "#000000"} 
          />
          <Button 
            text="Leaderboard" 
            onClick={() => handleNavigation('/leaderboard')} 
            background={location.pathname === '/leaderboard' ? undefined : "#FFFFFF"} 
            textColor={location.pathname === '/leaderboard' ? undefined : "#000000"} 
          />
          <Button text="0xe2d3A...Ac72EBea1" background="#FFFFFF" textColor="#000000" />

          {/* TODO: Add Theme Toggle Button  */}
          {/* <Button text={mode === 'dark' ? "Light Mode" : "Dark Mode"} onClick={toggleMode} /> */}

          <div className="">
            <img src={mode === 'dark' ? LIGHT_MODE : DARK_MODE} alt="MODE" onClick={toggleMode} className="cursor-pointer"/>
          </div>

          {/* TODO: Add Connect Wallet Button  */}
          {/* <Button text="Connect Wallet" onClick={() => {}} /> */}
        </div>
      </div>
      <SideDrawer mode={mode} toggleMode={toggleMode} isOpen={isDrawerOpen} onClose={toggleDrawer} handleNavigation={handleNavigation} />
    </div>
  );
};

export default Header;
