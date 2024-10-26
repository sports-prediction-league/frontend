import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center border-2 whitespace-nowrap font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#A3E96C] text-primary hover:bg-[#A3E96C]/80",
        dark: "bg-primary text-white hover:bg-[#A3E96C]/80",
        outline: "bg-transparent text-white border-white",
        secondary:
          "bg-white text-primary hover:bg-[#A3E96C] border-white hover:border-[#A3E96C]",
        ghost: "hover:bg-accent hover:text-white",
      },
      size: {
        custom: "h-10 w-[125px] text-base hover:text-lg text-sm items-start",
        default: "h-10 w-[125px] text-base hover:text-lg",
        sm: "h-8 text-sm hover:text-base",
        lg: "h-14 w-[215px] text-lg hover:text-xl",
        icon: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Button component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon" | "custom";
  input_ref?: React.LegacyRef<HTMLButtonElement>;
}

// Button component
const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  input_ref,
  className,
  ...props
}) => {
  return (
    <button
      ref={input_ref}
      className={cn(className, buttonVariants({ variant, size }))}
      {...props}
    />
  );
};

export default Button;

// export { Button, buttonVariants };
