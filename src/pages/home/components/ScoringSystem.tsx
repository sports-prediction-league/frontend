// common components
import Title from "../../../common/components/tittle/Title";

// assets

const ScoringSystem = () => {
  const scoringData = [
    {
      title: "2 PTS",
      description: "Correct prediction of only the match winner",
    },
    {
      title: "3 PTS",
      description:
        "Correct prediction of the match winner and goal range (0-2 or 3+)",
    },
    {
      title: "5 PTS",
      description: "Correct prediction of the exact result",
    },
  ];

  return (
    <div className="max-w-full flex flex-col lg:gap-[60px] gap-[44px] items-center justify-center xl:h-[694px] px-[16px] py-[34px] bg-[rgba(0,100,76,1)] scoring-system-bg">
      <Title title="Scoring System" forceWhite={true} />

      <div className="flex flex-wrap lg:gap-[44px] gap-[20px] justify-center">
        {scoringData.map((item, index) => (
          <div
            key={index}
            className="lg:h-[281px] h-[123px] lg:w-[404px] w-full px-[20px] dark:bg-spl-green-100 bg-spl-white rounded-[20px] flex flex-col items-center justify-center lg:gap-[10px] gap-[10px] scoring-system-box-shadow"
          >
            <p className="font-bold lg:text-[40px] text-[15px] lg:leading-[51px] leading-[15px] dark:text-spl-white text-spl-black">
              {item.title}
            </p>
            <p className="font-light lg:text-[20px] text-[12px] lg:leading-[26px] leading-[12px] dark:text-spl-white text-spl-black text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoringSystem;
