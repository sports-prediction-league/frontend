// context
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

// common
import Title from "../../../common/components/tittle/Title";

// assets
import HOW_IT_WORKS_MAN from "../../../assets/howItWorks/how_it_works_ man.svg";

// styles
// import "./styles.css";

const HowItWorks = () => {
  const { mode } = useContext(ThemeContext)!;

  const cardData = [
    {
      id: 1,
      description: "Join league",
    },
    {
      id: 2,
      description: "Make your predictions",
    },
    {
      id: 3,
      description: "Earn points & qualify for airdrop",
    },
  ];
  return (
    <div className="max-w-full flex flex-col items-center justify-center lg:px-0 px-[16px]">
      <img
        src={HOW_IT_WORKS_MAN}
        alt="HOW IT WORKS MAN"
        className="h-[388px] w-[181px] lg:hidden"
      />

      <Title
        className="text-center"
        title="How It Works"
        fontSizeSmall="text-[35px]"
      />

      <div className="w-full lg:w-fit flex flex-col items-center justify-center flex-wrap md:gap-[26px] gap-[20px] md:mt-[148px] mt-[24px] relative">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="lg:w-[1260px] w-full md:h-[148px] h-[100px] dark:bg-spl-green-100 bg-spl-white rounded-[20px] flex items-center justify-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] px-3"
          >
            <p className="dark:text-spl-white text-spl-black md:text-[30px] text-[15px] leading-[38px]  font-light">
              {card.description}
            </p>
          </div>
        ))}

        <img
          src={HOW_IT_WORKS_MAN}
          alt="HOW IT WORKS MAN"
          className="absolute hidden lg:block right-0 -top-[150px]"
        />
      </div>
    </div>
  );
};

export default HowItWorks;
