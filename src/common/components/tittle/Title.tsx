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
  return (
    <div className="w-full flex justify-center items-center">
      <p
        className={`text-[${fontSizeSmall ? fontSizeSmall : "20px"}] md:text-[${
          fontSizeMedium ? fontSizeMedium : "35px"
        }] font-bold leading-[45px] ${
          forceWhite ? "text-spl-white" : "dark:text-spl-white text-spl-black"
        }`}
      >
        {title}
      </p>
    </div>
  );
};

export default Title;
