// context
// import { useContext } from "react";
// import { ThemeContext } from "../../../context/ThemeContext";

// common
import Title from "../../../common/components/tittle/Title";

// assets
import HOW_IT_WORKS_MAN from "../../../assets/howItWorks/how_it_works_ man.svg";

const HowItWorks = () => {
  // const { mode } = useContext(ThemeContext)!;

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
    <div className="max-w-full flex flex-col items-center justify-center">
      <img
        src={HOW_IT_WORKS_MAN}
        alt="HOW IT WORKS MAN"
        className="h-[388px] w-[181px] lg:hidden"
      />

      <Title title="How It Works" className="text-xl" />

      <div className="w-full xxl:w-1/2 flex md:px-10 px-2 flex-col flex-wrap md:gap-[26px] gap-[20px] md:mt-[148px] mt-[24px] relative">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="w-full md:py-10 lg:py-16 px-3 py-5 dark:bg-spl-green-100 bg-spl-white rounded-[20px] flex items-center justify-center shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]"
          >
            <p className="dark:text-spl-white text-spl-black md:text-[30px] text-[15px] text-center leading-[38px]  font-light">
              {card.description}
            </p>
          </div>
        ))}

        <img
          src={HOW_IT_WORKS_MAN}
          alt="HOW IT WORKS MAN"
          className="absolute hidden h-[50rem] lg:block right-0 -top-[150px]"
        />
      </div>
    </div>
  );
};

export default HowItWorks;
