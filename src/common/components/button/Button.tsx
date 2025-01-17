// interfaces
import { TbLoader } from "react-icons/tb";
import { IButtonProps } from "../../../interfaces";

const Button = ({
  text,
  width = "w-fit",
  height = "h-[34px]",
  fontSize = "text-[14px]",
  onClick,
  loading,
  disabled,
  leftIcon,
  rounded = "rounded-[12px]",
  background,
  hoverBackground,
  textColor,
  fontWeight = "font-bold",
}: IButtonProps) => {
  return (
    <button
      className={`button-container px-[14px] flex justify-center items-center gap-[6px] border leading-[25.7px] ${width} ${height} ${fontSize} ${rounded} ${fontWeight}`}
      onClick={onClick}
      disabled={disabled}
      style={
        {
          "--button-background": background,
          "--button-background-hover": hoverBackground,
          "--text-color": textColor,
        } as React.CSSProperties
      }
    >
      {!loading && leftIcon && (
        <img src={leftIcon} alt="ICON" className="w-[16px] h-[16px]" />
      )}
      {!loading ? text : null}
      {loading ? (
        <TbLoader size={22} color="white" className="mr-1.5 animate-spin" />
      ) : null}
    </button>
  );
};

export default Button;
