// assets
import HASHED_BACKGROUND from "../../assets/scoringSystem/hashed_background.svg";
import SPL_LOGO_LARGE from "../../assets/footer/spl_logo_large.svg";
import X from "../../assets/socialMedia/x.svg";
import TELEGRAM from "../../assets/socialMedia/telegram.svg";
import { Link } from "react-router";

const Footer = () => {
  return (
    <div
      className={`md:min-h-[317px] md:block hidden h-fit w-full bg-spl-green-300 bg-cover bg-center pt-5 bg-no-repeat md:mt-[100px] mt-[50px] flex-col justify-between items-center`}
      style={{ backgroundImage: `url(${HASHED_BACKGROUND})` }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center max-w-full w-full md:px-[90px] px-[16px]">
        <div className="flex flex-col gap-[10px] md:w-[516px] w-full">
          <div className="flex items-center justify-center md:justify-start gap-[10px] w-full">
            <img
              src={SPL_LOGO_LARGE}
              alt="SPL LOGO"
              className="md:h-[80px] md:w-[80px] h-[24px] w-[24px]"
            />
            <p className="text-spl-white md:text-[32px] text-[15px] md:leading-[38px] leading-[18px] font-bold font-[Lato]">
              SPL
            </p>
          </div>

          <p className="text-spl-white md:text-[20px] text-[10px] md:leading-[25px] leading-[12px] font-light md:mt-5 mt-1 md:text-left text-center">
            SPL brings sports enthusiasts together to compete, predict, and win,
            providing opportunities to enhance skills, join leagues, and learn
            from top tipsters.
          </p>
        </div>

        <div className="flex justify-end items-center gap-[8px] md:mt-auto mt-3 md:mb-0 mb-3">
          <Link target="_blank" to="https://x.com/splxgg">
            <img
              src={X}
              alt="X"
              className="cursor-pointer hover:scale-110 transition-all duration-300 md:h-[37px] md:w-[37px] h-[16px] w-[16px]"
            />

          </Link>

          <Link target="_blank" to="https://t.me/splxgg">
            <img
              src={TELEGRAM}
              alt="TELEGRAM"
              className="cursor-pointer hover:scale-110 transition-all duration-300 md:h-[45px] md:w-[45px] h-[20px] w-[20px]"
            />

          </Link>
        </div>
      </div>

      <div className="w-full border-t-[2px] border-spl-black h-[46px] flex justify-center items-center">
        <p className="text-spl-white md:text-[20px] text-[10px] md:leading-[25px] leading-[12px] font-light">
          ©2024 All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
