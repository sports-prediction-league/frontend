import { FaMoon, FaSun } from "react-icons/fa"; // Import icons

const DarkmodeButton = ({
  mode,
  toggleMode,
}: {
  mode: string;
  toggleMode: () => void;
}) => {
  return (
    <div>
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        checked={mode === "dark"}
        onChange={toggleMode}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <FaMoon className={`icon ${mode === "dark" ? "active" : ""}`} />
        <FaSun className={`icon ${mode === "light" ? "active" : ""}`} />
        <span className="ball"></span>
      </label>
    </div>
  );
};

export default DarkmodeButton;
