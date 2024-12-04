// context
import { useContext } from "react";

// components
import Button from "../../common/components/button/Button";

// assets
import SPL_LOGO from "../../assets/header/spl_logo.svg";

// styles
import "./styles.scss";
import { ThemeContext } from "../../context/ThemeContext";

const Header = () => {
  const { mode, toggleMode } = useContext(ThemeContext)!;

  return (
    <div className="header-container">
      <div className="header-content">
        <img src={SPL_LOGO} alt="SPL LOGO" />

        <div className="connect-wallet-btn flex">
          {/* <Button text={mode === 'dark' ? "Light Mode" : "Dark Mode"} onClick={toggleMode} /> */}
          <Button text="Connect Wallet" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default Header;
