import { TbLoader } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import Assets from "src/assets";
import Button from "src/common/components/Button";
import LeaderBoardContainer from "src/common/components/LeaderBoardContainer";
import { formatDateNative, formatTimeNative } from "src/lib/utils";
import { useAppSelector } from "src/state/store";

export default function Home() {
  const { matches, loading_state } = useAppSelector((state) => state.app);
  const navigate = useNavigate();

  const services = [
    {
      title: "Expert Predictions",
      desc: "Access tips from top-performing tipsters to boost your accuracy.",
    },
    {
      title: "Competitive Leagues",
      desc: "Join public leagues or create your own to compete with friends and other sports fans.",
    },
    {
      title: "Personalized Tracking",
      desc: "Use your dashboard to monitor your performance, track your progress, and see how you stack up against others.",
    },
  ];

  const links = [
    {
      label: "Make Predictions",
      path: "#",
    },
    {
      label: "Earn Points",
      path: "#",
    },
    {
      label: "Rise to the Top",
      path: "#",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="px-4 md:px-6 py-28 md:py-56 mt-4 mb-6">
        <div className="flex flex-col items-center justify-center text-center gap-10">
          <h1 className="uppercase">
            YOUR PREMIER TIPSTER
            <br className="hidden md:flex" /> LEAGUE PLATFORM
          </h1>
          <p className="max-w-[650px] w-full text-base md:text-lg lg:text-xl">
            Uniting sports enthusiasts to compete, make predictions, and win,
            while offering opportunities to improve skills, join leagues, and
            learn from expert tipsters.
          </p>

          <Button
            variant={"secondary"}
            onClick={() => {
              navigate("/upcoming-matches");
            }}
            size={"lg"}
          >
            START PREDICTING
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="rounded-lg rounded-b-none bg-background flex items-center flex-col gap-10 md:gap-[80px] lg:gap-[120px] px-5 md:px-10 py-10 md:py-28">
          <div className="flex flex-col items-center text-center gap-4">
            <h2>WHAT WE DO</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {services.map((sv) => (
              <div
                key={sv.title}
                className="bg-secondary flex flex-col gap-3 text-foreground p-11 md:p-12 lg:p-[64px]"
              >
                <h4>{sv.title}</h4>
                <p className="text-base md:text-lg text-foreground opacity-80">
                  {sv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-foreground flex items-center flex-col gap-10 md:gap-[80px] lg:gap-[120px] px-5 md:px-10 py-10 md:py-28 text-primary">
          <div className="flex flex-col items-center text-center gap-4">
            <h2>How SPL Works</h2>
          </div>

          <div className="flex flex-col w-full">
            {links.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="h-20 md:h-[92px] flex items-center justify-center border-b border-primary-foreground w-full"
              >
                <h3 className="text-primary-foreground">{link.label}</h3>
              </Link>
            ))}
          </div>
        </div>

        {/* LEADER BOARD */}
        <div className="bg-background flex items-center flex-col gap-10 px-5 md:px-10 py-10 md:py-28">
          <div className="flex flex-col items-center text-center gap-4">
            <h2>Think You Can Make It to the Top?</h2>

            <p className="max-w-[1000px] w-full text-base md:text-lg font-normal">
              Keep making accurate predictions and watch your name rise on the
              leader board. Show everyone you have what it takes to be the best!
            </p>
          </div>

          {loading_state ? (
            <TbLoader size={42} className="mr-1.5 animate-spin" />
          ) : (
            <LeaderBoardContainer />
          )}
        </div>
        {/* LEADER BOARD */}

        <div className="bg-background flex items-center flex-col gap-10 px-5 md:px-10 py-10 md:py-28">
          <div className="flex flex-col items-center text-center gap-4">
            <h2>UPCOMING MATCHES</h2>

            <p className="max-w-[1000px] w-full text-base md:text-lg font-normal">
              See today's fixtures and make your predictions! Lock in your
              choices and compete with others. Join the action now!
            </p>
          </div>

          {loading_state ? (
            <TbLoader size={42} className="mr-1.5 animate-spin" />
          ) : (
            matches.slice(0, 1).map((group, _key) =>
              group.length ? (
                <div key={_key} className="flex flex-col gap-6 w-full">
                  <div className="p-4 h-[60px] relative">
                    <div className="size-full absolute top-0 left-0 bg-primary-foreground opacity-80">
                      <img
                        src={Assets.rough}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>

                    <div className="relative flex items-center">
                      <h5>{formatDateNative(group[0].details.fixture.date)}</h5>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {group.slice(0, 5).map((match, _key) => (
                      <div
                        key={_key}
                        className="p-2 lg:py-[64px] py-[40px]  bg-secondary rounded-lg flex flex-col gap-[64px]"
                      >
                        <div className="flex flex-col items-center text-center px-3">
                          <div className="flex items-center mb-4 gap-2 flex-wrap justify-center">
                            <img src={Assets.stadium} alt="" />
                            <h6 className="opacity-60">
                              {match.details?.fixture.venue.name}
                            </h6>
                          </div>

                          <div className="flex items-center justify-center sm:flex-row lg:gap-[48px] gap-5 mt-8">
                            <div className="flex-1 lg:w-[250px] flex flex-col items-center gap-3 sm:gap-8">
                              {match.details.teams.home.logo ? (
                                <img
                                  src={match.details.teams.home.logo}
                                  alt=""
                                  className=" lg:flex w-full lg:h-[200px] h-[70px] object-contain"
                                />
                              ) : null}
                              <h2 className="text-center lg:text-4xl text-sm line-clamp-1 lg:line-clamp-2">
                                {match.details.teams.home.name}
                              </h2>

                              {match.details.last_games ? (
                                <div className="flex justify-center items-start gap-2">
                                  {match.details.last_games.home?.map(
                                    (mp, index) => {
                                      if (mp === "Win")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-primary-foreground md:border-[3px] border-[2px] border-primary-foreground"
                                          ></span>
                                        );
                                      if (mp === "Draw")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-white md:border-[3px] border-[2px] border-muted-foreground"
                                          ></span>
                                        );
                                      if (mp === "Lose")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-[#EF4444] md:border-[3px] border-[2px] border-[#EF4444]"
                                          ></span>
                                        );
                                    }
                                  )}
                                </div>
                              ) : null}
                            </div>

                            <div className="mx-auto w-[80px] sm:w-auto flex-1 lg:w-[180px]">
                              <div className="flex items-center justify-between gap-2 md:gap-4 s">
                                <div className="h-[30px] lg:h-16 w-14 lg:w-[72px] border-2"></div>
                                <span className="lg:w-4 lg:h-2 w-1 h-0.5 bg-white" />
                                <div className="h-[30px] lg:h-16 w-14 lg:w-[72px] border-2"></div>
                              </div>
                            </div>

                            <div className="flex-1 lg:w-[250px] flex flex-col items-center gap-3 sm:gap-8">
                              {match.details.teams.away.logo ? (
                                <img
                                  src={match.details.teams.away.logo}
                                  alt=""
                                  className=" lg:flex w-full lg:h-[200px] h-[70px] object-contain"
                                />
                              ) : null}
                              <h2 className="text-center lg:text-4xl text-sm line-clamp-1 lg:line-clamp-2">
                                {match.details.teams.away.name}
                              </h2>

                              {match.details.last_games ? (
                                <div className="flex justify-center items-start gap-2">
                                  {match.details.last_games.away?.map(
                                    (mp, index) => {
                                      if (mp === "Win")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-primary-foreground md:border-[3px] border-[2px] border-primary-foreground"
                                          ></span>
                                        );
                                      if (mp === "Draw")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-white md:border-[3px] border-[2px] border-muted-foreground"
                                          ></span>
                                        );
                                      if (mp === "Lose")
                                        return (
                                          <span
                                            key={index}
                                            className="size-1.5 sm:size-[6px] md:size-3 rounded-full bg-[#EF4444] md:border-[3px] border-[2px] border-[#EF4444]"
                                          ></span>
                                        );
                                    }
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <h6 className="opacity-60 mt-4">
                            {formatTimeNative(match.details.fixture.date)}
                          </h6>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant={"secondary"}
                      size={"lg"}
                      className="mt-6 !w-full"
                      onClick={() => {
                        navigate("/upcoming-matches");
                      }}
                    >
                      START PREDICTING
                    </Button>
                  </div>
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </div>
  );
}
