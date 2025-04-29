// context
// import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

// components
import Button from "../../common/components/button/Button";
// import DarkmodeButton from "../../common/components/button/DarkmodeButton";
// import SideDrawer from "./SideDrawer";

// assets
import SPL_LOGO from "../../assets/header/spl_logo.svg";
import { useAppSelector } from "../../state/store";
import useConnect from "../../lib/useConnect";
// import ThemeToggle from "../../common/components/theme/ThemeToggle";
import toast from "react-hot-toast";
import ThemeToggle from "../../common/components/theme/ThemeToggle";
import { useState } from "react";

// styles
// import "./styles.css";

const Header = () => {
  // const { isDark } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  // const [isDrawerOpen, setDrawerOpen] = useState(false);

  const connected_address = useAppSelector(
    (state) => state.app.connected_address
  );
  const [connecting, setConnecting] = useState(false)
  const { handleConnect } = useConnect();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // const toggleDrawer = () => {
  //   setDrawerOpen(!isDrawerOpen);
  // };

  return (
    <div className="w-full md:py-5 py-3  flex items-center px-[16px]  lg:px-[90px] sticky top-0 z-50 dark:bg-[#042822] bg-white dark:shadow-none shadow-sm">
      <div className="flex flex-wra justify-between  items-start w-full  mx-auto">

        <div className="flex items-center gap-1 justify-between md:w-auto w-full">
          <img
            src={SPL_LOGO}
            alt="SPL LOGO"
            onClick={() => handleNavigation("/home")}
            className="cursor-pointer md:w-[40px] md:h-[40px] w-[25px] h-[25px]"
          />
          <ThemeToggle />

        </div>

        <div className="md:flex hidden flex-wrap justify-end items-center gap-[15px] ">
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
                setConnecting(true)
                await handleConnect({});
                setConnecting(false)
              } catch (error: any) {
                setConnecting(false)
                console.log(error)
                toast.error(error.message || "OOPPSS");

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
            loading={connecting}
            fontWeight="font-medium"
            fontSize=" md:text-sm text-xs leading-none"

          />

        </div>
      </div>

    </div>
  );
};

export default Header;
