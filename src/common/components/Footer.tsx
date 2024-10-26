import Assets from "src/assets";

const Footer = () => {
  return (
    <div className="bg-background flex flex-col px-5 md:px-10 mt-6">
      <div className="flex items-start flex-col sm:flex-row justify-between w-full py-10 border-b gap-2">
        <img
          src={Assets.logo}
          alt="logo"
          className="max-w-[250px] sm:max-w-[338px] lg:max-w-[538px] w-full object-contain"
        />

        <p className="sm:max-w-[299px]">
          Uniting sports enthusiasts to compete, make predictions, and win,
          while offering opportunities to improve skills, join leagues, and
          learn from expert tipsters.
        </p>
      </div>

      <div className="flex sm:items-center flex-col-reverse sm:flex-row justify-between w-full py-8 gap-2">
        <p>©{new Date().getFullYear()} All rights reserved.</p>

        <div className="flex items-center flex-wrap justify-between sm:justify-start gap-8">
          <a href="#" className="!text-base font-bold">
            X
          </a>
          <a href="#" className="!text-base font-bold">
            DISCORD
          </a>
          <a href="#" className="!text-base font-bold">
            TELEGRAM
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
