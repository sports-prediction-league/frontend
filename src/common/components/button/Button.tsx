// interfaces
import { IButtonProps } from "../../../interfaces";

// styles
import "./styles.css";

const Button = ({
  text,
  width = "w-fit",
  height = "h-[40px]",
  fontSize = "text-[16px]",
  onClick,
  disabled,
  leftIcon,
  rounded = "rounded-[12px]",
  background,
  hoverBackground,
  textColor,
}: IButtonProps) => {
  return (
    <button
      className={`button-container ${width} ${height} ${fontSize} ${rounded}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        '--button-background': background,
        '--button-background-hover': hoverBackground,
        '--text-color': textColor,
      } as React.CSSProperties}
    >
      {leftIcon && <img src={leftIcon} alt="ICON" className="w-[16px] h-[16px]" />}
      {text}
    </button>
  );
};

export default Button;
