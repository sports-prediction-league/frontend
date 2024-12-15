// common
import Title from "../../../common/components/tittle/Title";

// assets
import EXPART_PREDICTION from "../../../assets/whatWedo/expert_predictions.svg";
import GROUPED_INFO from "../../../assets/whatWedo/grouped_info.svg";
import WHAT_WE_DO_MOBILE from "../../../assets/whatWedo/what_we_do_mobile.svg";

const WhatWeDo = () => {
  return (
    <div className="max-w-full flex flex-col items-center justify-center md:px-[90px] px-[16px]">
      <Title title="What We Do" />

      <div className="flex justify-center md:mt-[60px] mt-[24px] w-full">
        {/* Display mobile image on small screens */}
        <div className="hidden lg:flex">
          <div className="">
            <img src={EXPART_PREDICTION} alt="EXPERT PREDICTION" />
          </div>
          <div className="flex-1">
            <img src={GROUPED_INFO} alt="GROUPED INFO" className="w-full h-full"/>
          </div>
        </div>
        <div className="block lg:hidden w-full">
          <img
            src={WHAT_WE_DO_MOBILE}
            alt="WHAT WE DO MOBILE"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
