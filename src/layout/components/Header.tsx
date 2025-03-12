// context
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// components
import Button from "../../common/components/button/Button";
// import DarkmodeButton from "../../common/components/button/DarkmodeButton";
// import SideDrawer from "./SideDrawer";

// assets
import SPL_LOGO from "../../assets/header/spl_logo.svg";
import { useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";
import ThemeToggle from "src/common/components/theme/ThemeToggle";
import toast from "react-hot-toast";

// styles
// import "./styles.css";

const Header = () => {
  // const { isDark } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const connected_address = useAppSelector(
    (state) => state.app.connected_address
  );
  const { handleConnect } = useConnect();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="w-full py-5  flex items-center px-[16px]  lg:px-[90px] sticky top-0 z-50 dark:bg-[#042822] bg-white dark:shadow-none shadow-sm">
      <div className="flex flex-wra justify-between  items-start w-full  mx-auto">
        <img
          src={SPL_LOGO}
          alt="SPL LOGO"
          onClick={() => handleNavigation("/home")}
          className="cursor-pointer md:w-[40px] md:h-[40px] w-[25px] h-[25px]"
        />

        {/* <div className="flex items-center justify-end my-5 mx-3">
          <ThemeToggle />
        </div> */}
        {/* <div className="rounded-full bg-spl-green-300 p-[5px] md:hidden">
          <FaBars onClick={toggleDrawer} className="text-white" />
        </div> */}

        <div className=" flex flex-wrap justify-end items-center gap-[15px] ">
          <Button
            text="Upcoming Matches"
            onClick={() => handleNavigation("/")}
            background={location.pathname === "/" ? undefined : "#FFFFFF"}
            textColor={location.pathname === "/" ? undefined : "#000000"}
            fontWeight="font-medium"
            fontSize=" md:text-sm text-xs leading-[13px]"
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
            fontSize=" md:text-sm text-xs leading-none"

          />
          <Button
            text={connected_address ? "Profile" : "Connect Wallet"}
            onClick={async () => {

              try {
                if (connected_address) {
                  handleNavigation("/profile");
                  return;
                }
                await handleConnect();
              } catch (error: any) {
                console.log(error)
                toast.error(error.message || "error here");

              }

            }}
            background={
              location.pathname === "/profile" || !connected_address
                ? undefined
                : "#FFFFFF"
            }
            textColor={
              location.pathname === "/profile" || !connected_address
                ? undefined
                : "#000000"
            }
            fontWeight="font-medium"
            fontSize=" md:text-sm text-xs leading-none"

          />
          {/* <Button
            text="Profile"
            onClick={() => handleNavigation("/profile")}
            background={
              location.pathname === "/profile" ? undefined : "#FFFFFF"
            }
            textColor={location.pathname === "/profile" ? undefined : "#000000"}
            fontWeight="font-medium"
          /> */}

          {/* <div className="">
            <ThemeToggle />
          </div> */}

          {/* TODO: Add Connect Wallet Button  */}
          {/* <Button text="Connect Wallet" onClick={() => {}} /> */}
        </div>
      </div>
      {/* <SideDrawer
        mode={mode}
        toggleMode={toggleMode}
        isOpen={isDrawerOpen}
        onClose={toggleDrawer}
        handleNavigation={handleNavigation}
      /> */}
    </div>
  );
};

export default Header;
