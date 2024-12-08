import React from 'react';
import Button from "../../common/components/button/Button";
import './styles.css'; // Add your styles here
import { FaTimes } from 'react-icons/fa'; // Import the close icon
import { useLocation } from 'react-router';
import DARK_MODE from "../../assets/header/dark_mode.svg";
import LIGHT_MODE from "../../assets/header/light_mode.svg";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  handleNavigation: (path: string) => void;
  mode: string;
  toggleMode: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose, handleNavigation, mode, toggleMode }) => {

    const location = useLocation();

  return (
    <div className={`side-drawer ${isOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center"> 
            <button onClick={onClose} aria-label="Close" className="w-[30px] h-[30px] flex justify-center items-center bg-spl-green-300 rounded-full">
                <FaTimes className="text-white"/> 
            </button>
            
            <img src={mode === 'dark' ? LIGHT_MODE : DARK_MODE} alt="MODE" onClick={toggleMode} className="cursor-pointer w-[80px] h-[30px]"/>
        </div>

      <div className="nav-buttons mt-[20px]">
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
      </div>
    </div>
  );
};

export default SideDrawer; 