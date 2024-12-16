interface TitleProps {
  title: string;
  forceWhite?: boolean;
  fontSizeSmall?: string;
  fontSizeMedium?: string;
  className?: string;
}

const Title = ({
  title,
  forceWhite = false,
  fontSizeSmall,
  fontSizeMedium,
  className,
}: TitleProps) => {
  const smallFontSize = fontSizeSmall || "text-[20px]";
  const mediumFontSize = fontSizeMedium || "md:text-[35px]";
  const textColor = forceWhite
    ? "text-spl-white"
    : "dark:text-spl-white text-spl-black";

  return (
    <div className="w-full flex justify-center items-center">
      <p
        className={`${smallFontSize} ${mediumFontSize} text-center font-bold leading-[45px] ${textColor} ${className}`}
      >
        {title}
      </p>
    </div>
  );
};

export default Title;
