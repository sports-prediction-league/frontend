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
      description: "Correct prediction of the match winner and goal range (0-2 or 3+)",
    },
    {
      title: "5 PTS",
      description: "Correct prediction of the exact result",
    },
  ];

  return (
    <div className="scoring-system">
      <Title title="Scoring System" forceWhite={true} />

      <div className="scoring-system-cards-container">
        {scoringData.map((item, index) => (
          <div
            key={index}
            className="md:h-[281px] h-[123px] lg:w-[404px] w-full px-[20px] dark:bg-spl-green-100 bg-spl-white rounded-[20px] flex flex-col items-center justify-center md:gap-[10px] gap-[10px] scoring-system-box-shadow"
          >
            <p className="font-bold md:text-[40px] text-[15px] md:leading-[51px] leading-[15px] dark:text-spl-white text-spl-black">
              {item.title}
            </p>
            <p className="font-light md:text-[20px] text-[12px] md:leading-[26px] leading-[12px] dark:text-spl-white text-spl-black text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoringSystem;
