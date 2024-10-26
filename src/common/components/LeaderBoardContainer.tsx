import { useEffect, useRef, useState } from "react";
import { TbLoader } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import Assets from "src/assets";
import { LeaderboardProp } from "src/state/slices/appSlice";
import { useAppSelector } from "src/state/store";
import toast from "react-hot-toast";
import { apiClient, feltToString } from "src/lib/utils";
import useContractInstance from "src/lib/useContractInstance";
import { cairo } from "starknet";
export default function LeaderBoardContainer() {
  const location = useLocation();
  const {
    leaderboard: data,
    loading_state,
    profile,
  } = useAppSelector((state) => state.app);

  const { getRPCProviderContract, getWalletProviderContract } =
    useContractInstance();

  const [should_trim, set_should_trim] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") {
      set_should_trim(false);
    } else {
      set_should_trim(true);
    }
  }, [location]);

  const { total_rounds, connected_address } = useAppSelector(
    (state) => state.app
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [filter, setFilter] = useState(false);

  const [filter_result, set_filter_result] = useState<LeaderboardProp[]>([]);
  const [activeRounds, setActiveRounds] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const get_filter = async (round: number) => {
    try {
      if (loading) return;
      setFilter(true);
      setLoading(true);
      const contract = connected_address
        ? getWalletProviderContract()
        : getRPCProviderContract();
      const tx = await contract!.get_leaderboard_by_round(
        cairo.uint256(0),
        cairo.uint256(1000),
        cairo.uint256(round)
      );

      let structured_data: LeaderboardProp[] = [];

      for (let i = 0; i < tx.length; i++) {
        const element = tx[i];
        structured_data.push({
          user: {
            username: feltToString(element.user),
          },
          totalPoints: Number(element.total_score),
        });
      }
      set_filter_result(structured_data);

      const response = await apiClient.get("/leaderboard_images");
      if (response.data.success) {
        const new_leaderboard = structured_data.map((mp) => {
          const find = response.data.data.find(
            (fd: any) =>
              fd.username.toString().toLowerCase() ===
              mp.user.username?.toString()?.toLocaleLowerCase()
          );

          if (find) {
            return {
              ...mp,
              user: {
                ...mp.user,
                profile_picture: find.image,
              },
            };
          }
          return mp;
        });

        set_filter_result(new_leaderboard);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);

      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  };

  return loading_state ? (
    <div className="flex items-center justify-center w-full">
      <TbLoader size={42} className="mr-1.5 animate-spin" />
    </div>
  ) : (
    <div className="w-full">
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4 w-full">
          <div className="p-4 h-[60px] relative">
            <div className="size-full absolute top-0 left-0 bg-primary-foreground opacity-80">
              <img
                src={Assets.rough}
                alt=""
                className="size-full object-cover"
              />
            </div>

            <div className="relative flex items-center">
              <div className="flex items-center gap-6 md:ml-28">
                <div
                  className="flex items-start gap-6 relative "
                  ref={dropdownRef}
                >
                  <h5>LEADERBOARD</h5>
                  <div className="flex flex-col items-center">
                    <button onClick={toggleDropdown}>Round</button>
                    {activeRounds ? (
                      <p className=" text-[9px] lg:text-xs  font-bold">
                        {activeRounds}
                      </p>
                    ) : null}
                  </div>
                  {filter ? (
                    <button
                      onClick={() => {
                        set_filter_result([]);
                        setFilter(false);
                        setActiveRounds(null);
                      }}
                    >
                      Clear
                    </button>
                  ) : null}

                  {isOpen && (
                    <div className="absolute z-50 right-0  h-60 overflow-y-auto w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {Array.from({ length: total_rounds }).map((_, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              get_filter(Number(index + 1));
                              setIsOpen(false);
                              setActiveRounds((index + 1).toString());
                            }}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left font-light"
                          >
                            Round {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center w-full">
              <TbLoader size={32} className="mr-1.5 animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="mx-auto sm:max-w-[400px] w-full hidden sm:flex flex-col gap-2">
                <div className="border-2 p-2 rounded-lg">
                  <div className="w-full aspect-[0.85]">
                    <img
                      src={
                        (filter ? filter_result : data).length
                          ? (filter ? filter_result : data)[0]?.user
                              ?.profile_picture
                            ? `data:image/jpeg;base64,${
                                (filter ? filter_result : data)[0]?.user
                                  ?.profile_picture
                              }`
                            : ""
                          : ""
                      }
                      alt=""
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                        (e.target as HTMLImageElement).src = Assets.dummyAvatar;
                      }}
                      loading="lazy"
                      className="size-full rounded-md object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between bg-secondary py-5 px-7">
                    <h3>
                      {(filter ? filter_result : data).length
                        ? (filter ? filter_result : data)[0]?.user?.username
                        : ""}
                    </h3>
                    <h3 className="text-primary-foreground">1</h3>
                  </div>
                  <div className="flex items-center justify-between bg-secondary py-3 px-7">
                    <h5>Total Points</h5>
                    <h5>
                      {Number(
                        (filter ? filter_result : data).length
                          ? (filter ? filter_result : data)[0]?.totalPoints
                          : 0
                      )?.toFixed(1)}
                    </h5>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="bg-foreground text-primary-foreground h-[42px] flex items-center">
                  <div className="flex items-center justify-center w-[60px] sm:w-20 h-full">
                    <h6>POSITION</h6>
                  </div>
                  <div className="flex items-center pl-16 flex-1">
                    <h6>PLAYER</h6>
                  </div>
                  <div className="flex items-center px-4 w-20 sm:w-[200px] h-full">
                    <h6>TOTAL</h6>
                  </div>
                </div>

                <div className="flex-col sm:h-[calc(100vh-60px)] w-full sm:overflow-y-auto">
                  <div className="flex flex-col gap-2 w-full">
                    {(should_trim
                      ? (filter ? filter_result : data).slice(0, 10)
                      : filter
                      ? filter_result
                      : data
                    ).map((_data: LeaderboardProp, _key: number) => {
                      return (
                        <div
                          key={_key}
                          className={`h-[48px] flex items-center border-2 ${
                            profile?.username === _data?.user?.username
                              ? "border-green-400"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-center w-[60px] sm:w-20 h-full bg-secondary text-primary-foreground">
                            <h6>{_key + 1}</h6>
                          </div>
                          <div className="flex items-center gap-4 pl-4 flex-1">
                            <div className="size-8 rounded-full">
                              <img
                                src={
                                  _data.user.profile_picture
                                    ? `data:image/jpeg;base64,${_data.user.profile_picture}`
                                    : ""
                                }
                                alt=""
                                onError={(e) => {
                                  (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                                  (e.target as HTMLImageElement).src =
                                    Assets.dummyAvatar;
                                }}
                                loading="lazy"
                                className="size-full rounded-full object-cover"
                              />
                            </div>
                            <h6>{_data.user.username}</h6>
                          </div>
                          <div className="flex items-center px-4 w-20 sm:w-[200px] h-full">
                            <h6>{Number(_data.totalPoints).toFixed(1)}</h6>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border rounded-md py-16 px-4  sm:flex items-center justify-center flex-col text-center gap-5">
          <h3>SCORING SYSTEM</h3>
          <p className="text-base md:text-lg">
            Here is how points are awarded on SPL
          </p>

          <div className="flex items-start flex-col sm:flex-row justify-between max-w-[950px] w-full gap-5 md:gap-10 mt-4">
            <div className="flex flex-col gap-2 bg-secondary p-8 w-full">
              <h4 className="text-[#28A267]">
                5 <small>PTS</small>
              </h4>

              <p className="text-sm text-[#ECF9F0]">
                Correct prediction of the exact result
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-secondary p-8 w-full">
              <h4 className="text-[#28A267]">
                3 <small>PTS</small>
              </h4>

              <p className="text-sm text-[#ECF9F0]">
                Correct prediction of the match winner and goal range (0-2 or
                3+)
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-secondary p-8 w-full">
              <h4 className="text-[#28A267]">
                2 <small>PTS</small>
              </h4>

              <p className="text-sm text-[#ECF9F0]">
                Correct prediction of only the match winner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
