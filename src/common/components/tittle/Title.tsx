interface TitleProps {
  title: string;
  forceWhite?: boolean;
  fontSizeSmall?: string;
  fontSizeMedium?: string;
}

const Title = ({
  title,
  forceWhite = false,
  fontSizeSmall,
  fontSizeMedium,
}: TitleProps) => {
  const smallFontSize = fontSizeSmall || "text-[20px]";
  const mediumFontSize = fontSizeMedium || "md:text-[35px]";
  const textColor = forceWhite
    ? "text-spl-white"
    : "dark:text-spl-white text-spl-black";

  return (
    <div className="w-full flex justify-center items-center">
      <p
        className={`${smallFontSize} ${mediumFontSize} font-bold leading-[45px] ${textColor}`}
      >
        {title}
      </p>
    </div>
  );
};

export default Title;
