import React, { useEffect, useRef, useState } from "react";
import Title from "../../../common/components/tittle/Title";
import LeaderBoardHero from "../components/LeaderBoardHero";
import PointCard from "../components/PointCard";
import toast from "react-hot-toast";
import { apiClient, feltToString } from "src/lib/utils";
import { LeaderboardProp } from "src/state/slices/appSlice";
import { cairo } from "starknet";
import { useAppSelector } from "src/state/store";
import useContractInstance from "src/lib/useContractInstance";

const LeaderBoard = () => {
  const {
    total_rounds,
    connected_address,
    leaderboard: data,
    profile,
    loading_state,
  } = useAppSelector((state) => state.app);

  const { getRPCProviderContract, getWalletProviderContract } =
    useContractInstance();
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

  const [filter, setFilter] = useState<boolean>(false);

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
      set_filter_result(
        structured_data.sort((a, b) => b.totalPoints - a.totalPoints)
      );

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

  return (
    <React.Fragment>
      <div className="md:my-10 my-5 md:mb-20">
        <Title title="Leaderboard" />
      </div>
      <LeaderBoardHero filter={filter} filter_result={filter_result} />

      <div className="flex flex-col justify-center items-center gap-[14px] md:mt-[72px] mt-[24px] w-full px-3">
        {(filter ? filter_result : data)
          .slice(0)
          .map((_data: LeaderboardProp, _key: number) => {
            return (
              <PointCard
                index={_key}
                data={_data}
                key={_key}
                active={
                  connected_address &&
                  _data?.user?.address?.toLowerCase() ===
                    connected_address.toLowerCase()
                    ? true
                    : false
                }
              />
            );
          })}
      </div>
    </React.Fragment>
  );
};

export default LeaderBoard;
