interface TitleProps {
  title: string;
  forceWhite?: boolean;
  fontSize?: {
    small?: string;
    medium?: string;
  };
}

const Title = ({ title, forceWhite = false, fontSize = { small: '20px', medium: '35px' } }: TitleProps) => {
  return (
    <div className="w-full flex justify-center items-center">
      <p
        className={`text-[${fontSize.small}] md:text-[${fontSize.medium}] font-bold leading-[45px] ${
          forceWhite ? "text-spl-white" : "dark:text-spl-white text-spl-black"
        }`}
      >
        {title}
      </p>
    </div>
  );
};

export default Title;
