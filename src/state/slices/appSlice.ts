import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { groupMatchesByDate } from "src/lib/utils";

interface Fixture {
  id: number;
  referee: string | null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number | null;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    match_status: "not_started" | "ended" | "live";
    status: "not_started" | "closed" | "live";
  };
}

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Teams {
  home: Team;
  away: Team;
}

export interface MatchData {
  details: {
    fixture: Fixture;
    league: League;
    teams: Teams;
    goals?: {
      home: string;
      away: string;
    };
    last_games?: { home?: string[]; away?: string[] };
  };

  scored: boolean;
  predicted: boolean;
  predictions: {
    prediction: {
      prediction: string;
      stake: string;
    };
  }[];
}

export interface LeaderboardProp {
  totalPoints: number;
  user: User;
}

interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string;
  address?: string;
}

export interface Prediction {
  inputed: boolean;
  match_id: string;
  home: Number;
  away: Number;
  stake: string;
}

export interface InitDataUnsafe {
  user?: User;
}

interface IAppState {
  leaderboard: LeaderboardProp[];
  matches: MatchData[][];
  total_rounds: number;
  current_round: number;
  loading_state: boolean;
  profile: null | User;
  is_mini_app: boolean;
  loaded: boolean;
  is_registered: boolean;
  show_register_modal: boolean;
  connected_address: string | null;
}

// Define the initial state using that type
const initialState: IAppState = {
  leaderboard: [],
  matches: [],
  loaded: false,
  is_registered: false,
  current_round: 0,
  show_register_modal: false,
  total_rounds: 0,
  loading_state: true,
  profile: null,
  is_mini_app: false,
  connected_address: null,
};

export const appSlice = createSlice({
  name: "app",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    bulkAddLeaderboard: (state, action: PayloadAction<LeaderboardProp[]>) => {
      const sorted = action.payload.sort(
        (a, b) => b.totalPoints - a.totalPoints
      );
      state.leaderboard = sorted;
    },

    addLeaderboard: (state, action: PayloadAction<LeaderboardProp>) => {
      state.leaderboard.push(action.payload);
      state.profile = {
        ...state.profile,
        username: action.payload.user.username,
        id: action.payload.user.id,
      };
    },

    updateMatches: (state, action: PayloadAction<MatchData[]>) => {
      const updated_matches = [];

      for (let i = 0; i < state.matches.length; i++) {
        const match_collection = state.matches[i];

        for (let j = 0; j < match_collection.length; j++) {
          const match = match_collection[j];

          const find = action.payload.find(
            (fd) =>
              fd.details.fixture.id.toString().trim().toLowerCase() ===
              match.details.fixture.id.toString().trim().toLowerCase()
          );

          if (find) {
            updated_matches.push({
              ...find,
              predicted: match.predicted,
              predictions: match.predictions,
            });
          } else {
            updated_matches.push(match);
          }
        }
      }

      state.matches = groupMatchesByDate(updated_matches);
    },

    bulkSetMatches: (state, action: PayloadAction<MatchData[][]>) => {
      state.matches = action.payload;
    },

    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },

    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.is_registered = action.payload;
    },

    setPredictions: (state, action: PayloadAction<Prediction[]>) => {
      const new_matches = state.matches.map((mp) => {
        return mp.map((mmp) => {
          const find = action.payload.find(
            (fd) => fd.match_id === mmp.details.fixture.id.toString()
          );
          if (find) {
            return {
              ...mmp,
              predicted: true,
              predictions: [
                {
                  prediction: {
                    prediction: `${find.home}:${find.away}`,
                    stake: find.stake,
                  },
                },
              ],
            };
          }

          return mmp;
        });
      });

      state.matches = new_matches;
    },

    setConnectedAddress: (state, action: PayloadAction<any>) => {
      state.connected_address = action.payload;
    },

    setShowRegisterModal: (state, action: PayloadAction<boolean>) => {
      state.show_register_modal = action.payload;
    },

    updateLeaderboardImages: (
      state,
      action: PayloadAction<{ username: string; image: string }[]>
    ) => {
      const new_leaderboard = state.leaderboard.map((mp) => {
        const find = action.payload.find(
          (fd) =>
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

      state.leaderboard = new_leaderboard;
    },

    setRounds: (state, action: PayloadAction<number[]>) => {
      state.total_rounds = action.payload[0];
      state.current_round = action.payload[1];
    },

    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading_state = action.payload;
    },

    setIsMiniApp: (state, action: PayloadAction<boolean>) => {
      state.is_mini_app = action.payload;
    },

    updatePredictionState: (
      state,
      action: PayloadAction<
        {
          matchId: string;
          keyIndex: number;
          prediction: {
            prediction: string;
            stake: string;
          };
        }[]
      >
    ) => {
      for (let i = 0; i < action.payload.length; i++) {
        const element = action.payload[i];
        const matchId = element.matchId;
        const keyIndex = element.keyIndex;
        const prediction = element.prediction;
        if (keyIndex < state.matches.length && state.matches[keyIndex].length) {
          const newMatchesConstruct = state.matches[keyIndex].map((mp) => {
            if (mp.details.fixture.id.toString() === matchId) {
              return { ...mp, predicted: true, predictions: [{ prediction }] };
            }
            return mp;
          });
          state.matches[keyIndex] = newMatchesConstruct;
        }
      }
    },

    update_profile: (state, action: PayloadAction<User>) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
    },
  },
});

export const {
  bulkAddLeaderboard,
  bulkSetMatches,
  setRounds,
  updatePredictionState,
  setLoadingState,
  setIsMiniApp,
  update_profile,
  setConnectedAddress,
  setPredictions,
  setLoaded,
  updateLeaderboardImages,
  setShowRegisterModal,
  setIsRegistered,
  addLeaderboard,
  updateMatches,
} = appSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default appSlice.reducer;
