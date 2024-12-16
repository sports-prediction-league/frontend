// context
import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

// components
import Button from "../../common/components/button/Button";
import DarkmodeButton from "../../common/components/button/DarkmodeButton";
import SideDrawer from "./SideDrawer";
import { FaBars } from "react-icons/fa";

// assets
import SPL_LOGO from "../../assets/header/spl_logo.svg";

// styles
// import "./styles.css";

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
    <div className="w-full py-5 flex items-center px-[16px]  lg:px-[90px] sticky top-0 z-50 dark:bg-[#042822] bg-white dark:shadow-none shadow-sm">
      <div className="flex justify-between items-center w-full  mx-auto">
        <img
          src={SPL_LOGO}
          alt="SPL LOGO"
          onClick={() => handleNavigation("/")}
          className="cursor-pointer md:w-[40px] md:h-[40px] w-[25px] h-[25px]"
        />

        <div className="rounded-full bg-spl-green-300 p-[5px] md:hidden">
          <FaBars onClick={toggleDrawer} className="text-white" />
        </div>

        <div className=" md:flex items-center gap-[15px] hidden">
          <Button
            text="Upcoming Matches"
            onClick={() => handleNavigation("/prediction")}
            background={
              location.pathname === "/prediction" ? undefined : "#FFFFFF"
            }
            textColor={
              location.pathname === "/prediction" ? undefined : "#000000"
            }
            fontWeight="font-medium"
          />
          <Button
            text="Leaderboard"
            onClick={() => handleNavigation("/leaderboard")}
            background={
              location.pathname === "/leaderboard" ? undefined : "#FFFFFF"
            }
            textColor={
              location.pathname === "/leaderboard" ? undefined : "#000000"
            }
            fontWeight="font-medium"
          />
          <Button
            text="Profile"
            onClick={() => handleNavigation("/profile")}
            background={
              location.pathname === "/profile" ? undefined : "#FFFFFF"
            }
            textColor={location.pathname === "/profile" ? undefined : "#000000"}
            fontWeight="font-medium"
          />

          <div className="">
            <DarkmodeButton mode={mode} toggleMode={toggleMode} />
          </div>

          {/* TODO: Add Connect Wallet Button  */}
          {/* <Button text="Connect Wallet" onClick={() => {}} /> */}
        </div>
      </div>
      <SideDrawer
        mode={mode}
        toggleMode={toggleMode}
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        handleNavigation={handleNavigation}
      />
    </div>
  );
};

export default Header;
