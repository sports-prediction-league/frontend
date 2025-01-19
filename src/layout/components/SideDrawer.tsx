import React from "react";
import Button from "../../common/components/button/Button";
import { FaTimes } from "react-icons/fa"; // Import the close icon
import { useLocation } from "react-router";
import DarkmodeButton from "../../common/components/button/DarkmodeButton";
import { useAppSelector } from "src/state/store";
import useConnect from "src/lib/useConnect";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  handleNavigation: (path: string) => void;
  mode: string;
  toggleMode: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  handleNavigation,
  mode,
  toggleMode,
}) => {
  const location = useLocation();
  const connected_address = useAppSelector(
    (state) => state.app.connected_address
  );
  const { handleConnect } = useConnect();

  return (
    <div className={`side-drawer ${isOpen ? "open" : ""}`}>
      <div className="flex justify-between items-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="w-[30px] h-[30px] flex justify-center items-center bg-spl-green-300 rounded-full"
        >
          <FaTimes className="text-white" />
        </button>

        <DarkmodeButton mode={mode} toggleMode={toggleMode} />
      </div>

      <div className="nav-buttons mt-[20px]">
        <Button
          text="Upcoming Matches"
          onClick={() => {
            onClose();
            handleNavigation("/");
          }}
          background={location.pathname === "/" ? undefined : "#FFFFFF"}
          textColor={location.pathname === "/" ? undefined : "#000000"}
          fontWeight="font-medium"
        />
        <Button
          text="Leaderboard"
          onClick={() => {
            onClose();
            handleNavigation("/leaderboard");
          }}
          background={
            location.pathname === "/leaderboard" ? undefined : "#FFFFFF"
          }
          textColor={
            location.pathname === "/leaderboard" ? undefined : "#000000"
          }
          fontWeight="font-medium"
        />
        <Button
          text={connected_address ? "Profile" : "Connect Wallet"}
          onClick={async () => {
            if (connected_address) {
              onClose();
              handleNavigation("/profile");
              return;
            }
            await handleConnect();
            onClose();
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
        />
      </div>
    </div>
  );
};

export default SideDrawer;
