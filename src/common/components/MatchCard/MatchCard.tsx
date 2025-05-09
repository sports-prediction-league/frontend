import HASHED_BACKGROUND from "../../../assets/scoringSystem/hashed_background.svg";
import BX_STATS from "../../../assets/buttons/bx_stats.svg";
import USERS_SOLID from "../../../assets/buttons/users_solid.svg";
import { GroupedVirtualMatches, makePrediction, MatchData, removeVirtualMatchGroup } from "../../../state/slices/appSlice";
import { useEffect, useState } from "react";
import { formatTimeNative } from "../../../lib/utils";
import { useAppDispatch } from "../../../state/store";


interface Props {
  active?: boolean;
  matches: GroupedVirtualMatches;
  onClickGameSimul: (match: MatchData) => void
  onStartGame: () => void;
  onShowComingSoon: () => void;

}

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds}mins`;
};
const MatchCard = ({ active, matches, onClickGameSimul, onStartGame, onShowComingSoon }: Props) => {
  const dispatch = useAppDispatch();
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState<"Ongoing" | "Upcoming" | "Ended">("Upcoming"); // "Upcoming", "Ongoing", "Ended"

  useEffect(() => {
    if (active) {
      setStatus("Ongoing");
      onStartGame()
    }

    let hasDispatchedEvent = false; // Ensures event fires only once
    const interval = setInterval(() => {
      const now = Date.now();
      const matchStart = new Date(matches.date).getTime();
      const matchEnd = matchStart + 2 * 60 * 1000; // 2 minutes duration

      if (now < matchStart) {
        // Match hasn't started
        setTimeLeft(formatTime(matchStart - now));
        setStatus("Upcoming");
      } else if (now >= matchStart && now < matchEnd) {
        // Match is ongoing
        // if (predictions[matches.matches[0].details.fixture.id]) {
        //   removePredictions(matches.matches.map(mp => mp.details.fixture.id));
        // }
        if (!matches.matches[0].details.goals && !hasDispatchedEvent) {
          console.log("Match just started! Handling logic once...");
          const event = new CustomEvent("matchStatusChange", {
            detail: matches.matches.map(mp => mp.details.fixture.id),
          });
          window.dispatchEvent(event);
          hasDispatchedEvent = true; // Prevent multiple dispatches
        }
        setTimeLeft(formatTime(matchEnd - now));
        setStatus("Ongoing");
      } else {
        // Match has ended
        setTimeLeft("0s");
        setStatus("Ended");

        dispatch(removeVirtualMatchGroup(matches.date));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [matches]);


  if (status === "Ended") {
    return null
  }

  return <div
    className={` w-full my-8 ${status === "Ongoing" ? "bg-[rgba(0,100,76,1)]  border-2 border-spl-orange" : "border-2 dark:border-[#007332] border-[#0000001A]"}  bg-cover bg-center p-2 rounded-lg bg-no-repeat`}
    style={status === "Ongoing" ? { backgroundImage: `url(${HASHED_BACKGROUND})` } : {}}
  >
    <div className={`dark:bg-[#031614] bg-[#E5EFED]  ${status === "Ongoing" ? "dark:text-[#00CB59] text-[#064F43]" : "dark:text-white/80 text-black/80"} rounded-t-lg p-1 text-xs gap-1 md:gap-0  flex items-center md:justify-between justify-center flex-wrap px-4`}>
      <p className="">{matches.matches[0].details.league.flag} {matches.matches[0].details.league.country} {status === "Ongoing" ? "live" : "upcoming"} matches</p>
      {/* {status === "Ongoing" ? <p className="">H1 32:20</p> : null} */}
      <p className=" font-light text-[9px]">Round {status === "Ongoing" ? "ends" : "starts"} in: {timeLeft}</p>
    </div>


    {matches.matches.map((match, index) => {
      return <Match
        onShowComingSoon={onShowComingSoon}
        onClickGameSimul={onClickGameSimul} status={status} key={index} match={match} />
    })}

  </div>
}


export default MatchCard

interface MatchProps {
  match: MatchData;
  // onSelectOdd: (match_id: string, value: string) => void;
  // predictions: Record<string, any>;
  status: "Ongoing" | "Upcoming" | "Ended";
  onClickGameSimul: (match: MatchData) => void;
  onShowComingSoon: () => void;



}

const Match = ({ match, status, onClickGameSimul, onShowComingSoon }: MatchProps) => {

  const [score, setScore] = useState({ home: 0, away: 0 });
  // const [gameTime, setGameTime] = useState(0); // Track match time in seconds

  useEffect(() => {
    const matchStart = new Date(match.details.fixture.date).getTime();
    const matchEnd = matchStart + 2 * 60 * 1000; // Match lasts 2 minutes
    setScore({ home: 0, away: 0 })
    const events = match.details.events || []; // All match events

    // Function to update the game time and track goals
    const updateGameProgress = () => {
      const now = Date.now();

      if (now < matchStart) {
        // setGameTime(0); // Match hasn't started yet
        return;
      }

      if (now >= matchEnd) {
        // setGameTime(120); // Match ended (2 minutes = 120 seconds)
        clearInterval(interval);
        return;
      }

      // Calculate elapsed game time in seconds
      const elapsedSeconds = Math.floor((now - matchStart) / 1000);
      // setGameTime(elapsedSeconds);

      // Filter goals that should be counted at the current time
      let homeGoals = 0;
      let awayGoals = 0;

      events.forEach(event => {
        if (event.type === "goal" && event.team) {
          if (event.time <= elapsedSeconds) {
            // Count goal only if its time has passed
            if (event.team === "home") homeGoals++;
            else awayGoals++;
          }
        }
      });

      setScore({ home: homeGoals, away: awayGoals });
    };

    // Start interval to track game progress
    const interval = setInterval(updateGameProgress, 1000);

    return () => clearInterval(interval);
  }, [match]);


  const dispatch = useAppDispatch();
  return <div className="md:px-3 px-0 my-5">
    <div className="dark:bg-[#031614] bg-white dark:border-[#007332] border-[#E4E5E5] border-2 rounded-lg">
      <p className="dark:text-white/80 text-black/80 text-[9px] pilat p-3 font-light">{match.details.league.league}&nbsp;&nbsp; {formatTimeNative(new Date(match.details.fixture.date).toISOString())}</p>
      <div className="grid grid-cols-12 gap-2 items-center p-3 dark:text-white text-black">
        <div className="md:col-span-4 col-span-8 border-r space-y-3 border-r-[#00644C] pr-2">
          <div className="flex md:text-sm text-xs items-center gap-2 justify-between">
            <p className="line-clamp-1">{match.details.teams.home.name}</p>
            <p>{score.home}</p>
          </div>
          <div className="flex md:text-sm text-xs items-center justify-between gap-2">
            <p className="line-clamp-1">{match.details.teams.away.name}</p>
            <p>{score.away}</p>
          </div>
        </div>

        <div className="md:col-span-8 col-span-4 ">
          <div className="flex md:flex-nowrap flex-wrap justify-between items-center w-full gap-2 text-white">
            {
              Object.keys(match.details.odds).map((odd_key, index) => {
                const odd = (match.details.odds as any)[odd_key];
                return <button disabled={status !== "Upcoming"} key={index} onClick={() => {
                  dispatch(makePrediction([{ date: match.details.fixture.date, league: match.details.league.league, match_id: match.details.fixture.id, key: odd_key, id: odd.id }]))
                }}
                  className={`border-[0.1px] ${match.prediction?.key === odd_key ? "border-[#00000033]" : "border-[#00CB59]"} w-full md:rounded-md rounded text-xs flex items-center justify-between gap-2 md:px-3 px-1.5 md:py-2 py-0.5 [box-shadow:0px_6.5px_32.5px_0px_#00CA9A1A] ${match.prediction?.key === odd_key ? "bg-[#FBAE0C]" : "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]"}`}
                >
                  <p className="text-white/80 md:text-[9px] text-[7px] capitalize">{odd_key}</p><p className=" md:text-[9px] text-[7px]">{odd.odd}</p></button>
              })
            }
          </div>
        </div>


      </div>
      <div className="bg-[#00644C33] rounded-b-[6px] flex items-center justify-between px-3 py-1">
        <button onClick={onShowComingSoon} className="text-start md:text-[10px] text-[7px] dark:text-[#00CB59] text-[#064F43]">See More Goal Options</button>
        <div className="flex items-center gap-2 text-white">
          <button onClick={() => { onClickGameSimul(match) }} className="bg-[#00644C] md:text-[10px] text-[7px] flex items-center gap-0.5 md:px-3 px-1.5 md:py-2 py-1 rounded font-light"> <img src={BX_STATS} className="w-3" alt="" /> Watch game</button>
          <button onClick={onShowComingSoon} className="bg-[#00644C] md:text-[10px] text-[7px] flex items-center gap-0.5 md:px-3 px-1.5 md:py-2 py-1 rounded font-light"> <img src={USERS_SOLID} className="w-3" alt="" /> See team stats</button>
        </div>
      </div>
    </div>
  </div>
}