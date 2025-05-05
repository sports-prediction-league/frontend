import { useEffect, useState } from "react";

// components
import MatchHero from "../components/MatchHero";
import MatchCard from "../../../common/components/MatchCard/MatchCard";

// assets
import { useAppSelector } from "../../../state/store";

import ComingSoonModal from "../../../common/components/modal/ComingSoonModal";
import HASHED_BACKGROUND from "../../../assets/scoringSystem/hashed_background.svg";
import PredictionSlip from "../components/PredictionSlip";
import { Loader, X } from "lucide-react";
import { MdOnlinePrediction } from "react-icons/md";
import { Modal } from "antd";
import { useTheme } from "../../../context/ThemeContext";
import SoccerGame, { GameEvent } from "../../home/components/Play";
import { Teams } from "../../../state/slices/appSlice";
import useIsMobile from "../../../lib/useMobile";



const Leagues = [
  {
    id: 1,
    league: "Premier League",
    country: "England",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  },
  {
    "id": 2,
    "league": "La Liga",
    "country": "Spain",
    flag: "🇪🇸"
  },
  {
    "id": 3,
    "league": "Serie A",
    "country": "Italy",
    flag: "🇮🇹"
  },
  {
    "id": 4,
    "league": "Bundesliga",
    "country": "Germany",
    flag: "🇩🇪"
  },
  {
    "id": 5,
    "league": "Ligue 1",
    "country": "France",
    flag: "🇫🇷"
  }
]

const Match = () => {

  const {
    matches,
    loading_state
  } = useAppSelector((state) => state.app);

  const [current_league, set_current_league] = useState<number>(0);


  const [gameSimul, setGameSimul] = useState<{
    gameEvent: GameEvent[],
    teams: Teams
  } | null>(null)



  const [showSlipIcon, setShowSlipIcon] = useState(false);

  useEffect(() => {
    // console.log("changed", matches.virtual.flat())
    if (matches.virtual.map(mp => mp.matches).flat()
      .filter(
        (ft) =>
          Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
      ).length > 0) {
      setShowSlipIcon(true)
    } else {
      setShowSlipIcon(false)
      set_slip_open(false);
    }
  }, [matches])



  const [open_modal, set_open_modal] = useState(false);
  const [slip_open, set_slip_open] = useState(false);
  const [showGameSimul, setShowGameSimul] = useState(false);
  const { isDark, } = useTheme();
  const isMobile = useIsMobile()

  return (
    <div className="xl:px-48 px-3" >
      <MatchHero />
      <Modal
        wrapClassName={isDark ? "dark" : undefined}
        open={slip_open && isMobile && matches.virtual.map((mp) => mp.matches)
          .flat().filter(
            (ft) =>
              Boolean(ft.prediction) && ft.details.fixture.date > Date.now() && !ft.predicted
          ).length > 0}
        onCancel={() => {
          set_slip_open(false);
        }}

        styles={{
          content: {
            background: isDark ? "#042822" : "white",
            border: "none",
            borderRadius: "10px",
            padding: "15px 2px"
          },

        }}
        destroyOnClose

        closeIcon={<X color={isDark ? "white" : "rgba(0,0,0,.8)"} />}

        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}

      >
        <div className="p-2">
          <PredictionSlip />
        </div>
      </Modal>



      <Modal
        wrapClassName={isDark ? "dark" : undefined}
        open={showGameSimul}
        onCancel={() => {
          setShowGameSimul(false);
          setGameSimul(null)
        }}

        styles={{
          content: {
            background: isDark ? "#042822" : "white",
            border: "none",
            borderRadius: "10px",
            padding: "15px 2px"
          },

        }}
        destroyOnClose

        closeIcon={<X color={isDark ? "white" : "rgba(0,0,0,.8)"} />}

        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}

      >
        <div className=" mt-10">
          <SoccerGame teams={gameSimul?.teams} gameEvent={gameSimul?.gameEvent} />
        </div>
      </Modal>


      <ComingSoonModal
        open_modal={open_modal}
        onClose={() => {
          set_open_modal(false);
        }}
      />

      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px] mt-5">

        <div
          className={` w-full overflow-x-auto bg-spl-green-300 bg-cover bg-center px-3 py-3 rounded-lg bg-no-repeat flex items-center justify-between gap-2`}
          style={{ backgroundImage: `url(${HASHED_BACKGROUND})` }}
        >

          <button onClick={() => set_current_league(0)} className={`[box-shadow:0px_4px_4px_0px_#00000040] whitespace-nowrap w-full ${current_league === 0 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === 0 ? "text-spl-white" : "text-black"} font-light py-1.5 px-4 rounded-lg pilat`}>All Matches</button>
          <button onClick={() => set_current_league(1)} className={`[box-shadow:0px_4px_4px_0px_#00000040] whitespace-nowrap w-full ${current_league === 1 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === 1 ? "text-spl-white" : "text-black"} font-light py-1.5 px-4 rounded-lg pilat`}>Upcoming Matches</button>
          {
            Leagues.map((league, index) => {
              return <button onClick={() => set_current_league(index + 2)} key={index + 2} className={`w-full [box-shadow:0px_4px_4px_0px_#00000040] ${current_league === index + 2 ? "bg-[linear-gradient(#00644C,#00644C),radial-gradient(circle_at_0%_0%,rgba(0,202,154,0.6)_0%,rgba(0,100,76,0.6)_100%)]" : "bg-white"} border-[#00644C] border-[1.34px] text-xs ${current_league === index + 2 ? "text-spl-white" : "text-black"} font-light py-1 px-4 rounded-lg pilat flex items-center gap-1 justify-center`}><span className="text-sm">{league.flag}</span> <span>{league.country}</span></button>
            })
          }
        </div>
      </div>



      {loading_state ? <div className="flex mt-10 items-center justify-center">
        <Loader size={22} className="mr-1.5 animate-spin dark:text-white text-black " />
      </div> : null}

      {!loading_state && matches.virtual.length == 0 ?
        <div className="flex mt-10 items-center justify-center">
          <p className="dark:text-white/50 text-black/50">No matches</p>
        </div> : null
      }




      <div className=" w-full flex flex-col md:gap-[90px] gap-[18px]">
        <div className="grid grid-cols-12 w-full gap-3">
          <div className="md:col-span-8 col-span-12 w-full">

            {(current_league < 2 ? matches.virtual : matches.virtual.filter(ft => ft.league.toLowerCase() === Leagues[current_league - 2].league.toLowerCase())).map((match, index) => {
              return <MatchCard onClickGameSimul={(game) => {
                setGameSimul({ gameEvent: game.details.events ?? [], teams: game.details.teams })
                setShowGameSimul(true)
              }} key={index} matches={match} active={Date.now() >= new Date(match.date).getTime()} />
            })}
          </div>
          <div className="col-span-4 md:block hidden">
            <PredictionSlip />

          </div>
        </div>
      </div>

      {
        showSlipIcon ?
          <div className="md:hidden fixed bottom-20 right-10">
            <button title="Predictions" onClick={() => {
              set_slip_open(!slip_open)
            }} className="bg-spl-green-100 p-3 shadow-xl rounded-full"><MdOnlinePrediction size={25} color="#ffffff" /></button>

          </div>
          : null
      }
    </div>
  );
};

export default Match;
