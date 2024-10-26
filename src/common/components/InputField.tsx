import React from "react";
// import OTPInput from "react-otp-input";
import { cn } from "src/lib/utils";

const InputField = (props: {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: any;
  onIconClick?: () => void;
  disabled?: boolean;
  inputType?: string;
  showLabel?: boolean;
}) => {
  const handleOTPChange = (otp: string) => {
    props.onChange(otp);
  };

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      {props.showLabel && (
        <label htmlFor={props.name} className="text-sm uppercase">
          {props.placeholder.toUpperCase()}
        </label>
      )}
      <div
        className={cn("relative h-14 w-full", {
          "opacity-50 cursor-not-allowed": props.disabled,
        })}
      >
        {props.inputType === "otp" ? (
          <div />
        ) : (
          <input
            disabled={props.disabled}
            name={props.name}
            type={props.type || "text"}
            placeholder={props.placeholder}
            autoComplete="off"
            value={props.value}
            onChange={props.onChange}
            onBlur={props.onBlur}
            className={cn(
              "size-full border rounded-md text-base px-5 pr-12 bg-[#003428] outline-none focus:border-[#A3E96C] transition-colors disabled:pointer-events-none disabled:cursor-not-allowed",
              {
                "border-[#EF4444]": props.error,
              }
            )}
          />
        )}
        {props.icon && props.inputType !== "otp" && (
          <props.icon
            size={22}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 right-4 opacity-60",
              {
                "cursor-pointer": props.type === "password",
                "cursor-not-allowed": props.disabled,
              }
            )}
            onClick={props.onIconClick} // Handle icon click
          />
        )}
      </div>
      {props.error && (
        <span className="text-xs text-[#EF4444]">{props.error}</span>
      )}
    </div>
  );
};

export default InputField;
