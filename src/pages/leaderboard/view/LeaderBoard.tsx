import React from "react";
import Title from "../../../common/components/tittle/Title";
import LeaderBoardHero from "../components/LeaderBoardHero";
import PointCard from "../components/PointCard";
import { LeaderboardProp } from "../../../state/slices/appSlice";
import { useAppSelector } from "../../../state/store";

const LeaderBoard = () => {
  const {
    connected_address,
    leaderboard: data,
    profile,
  } = useAppSelector((state) => state.app);

  return (
    <React.Fragment>
      <div className="md:my-10 my-5 md:mb-20">
        <Title title="Leaderboard" />
      </div>
      <LeaderBoardHero />

      <div className="flex flex-col justify-center items-center gap-[14px] md:mt-[72px] mt-[24px] w-full px-3">
        {(data)
          .slice(3)
          .map((_data: LeaderboardProp, _key: number) => {
            return (
              <PointCard
                index={_key + 3}
                data={_data}
                key={_key}
                active={
                  _data.user?.username?.toLowerCase() ===
                    profile?.username?.toLowerCase() ||
                    (connected_address &&
                      _data?.user?.address?.toLowerCase() ===
                      connected_address.toLowerCase())
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
