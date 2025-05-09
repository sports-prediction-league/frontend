import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getTagName,
  groupMatchesByRound,
  groupVirtualMatches,
} from "../../lib/utils";

interface Fixture {
  id: string;
  referee: string | null;
  timezone: string;
  date: number;
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

export type UserPrediction = {
  match_: {
    id: string;
    timestamp: number;
    home: {
      id: string;
      goals: {
        Some?: number;
        None?: boolean;
      };
    };
    away: {
      id: string;
      goals: {
        Some?: number;
        None?: boolean;
      };
    };
    round: {
      Some?: number;
      None?: boolean;
    };
    match_type: {
      variant: {
        Live?: boolean;
        Virtual?: boolean;
      };
    };
  };
  prediction: Prediction;
};

type Position = {
  x: number;
  y: number;
};

type GameEvent = {
  time: number;
  type: "move" | "goal" | "second-half";
  position: Position;
  team?: "home" | "away";
};

interface League {
  id: number;
  league: string;
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

export type Teams = {
  home: Team;
  away: Team;
};

export type GroupedVirtualMatches = {
  date: string;
  league: string;
  matches: MatchData[];
};

export interface PredictionOdds {
  home: {
    id: string;
    odd: number;
  };
  away: {
    id: string;
    odd: number;
  };
  draw: {
    id: string;
    odd: number;
  };
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
    events?: GameEvent[];
    odds: PredictionOdds;
    last_games?: { home?: string[]; away?: string[] };
  };
  round: number;

  scored?: boolean;
  predicted?: boolean;
  prediction?: {
    key?: string;
    id?: string;
  };
}

export interface LeaderboardProp {
  totalPoints: number;
  user: User;
}

interface User {
  id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_picture?: string;
  address?: string;
  point?: {
    point: number;
    rank: number;
  };
}

export type Prediction = {
  stake: number;
  odd: {
    Some?: {
      value: number;
      tag: string;
    };
    None?: boolean;
  };
  prediction_type: {
    variant: {
      Multiple?: {
        match_id: string;
        pair_id: string;
        odd: string;
      };
      Single?: {
        match_id: string;
        odd: string;
      };
    };
  };
};

export interface InitDataUnsafe {
  user?: User;
}

export interface ConnectCalldata {
  type: "none" | "prediction";
  data?: any;
}

interface IAppState {
  leaderboard: LeaderboardProp[];
  matches: {
    virtual: GroupedVirtualMatches[];
    live: MatchData[][];
  };
  claimingReward: boolean;
  predicting: boolean;
  prediction_history: UserPrediction[][];
  total_rounds: number;
  current_round: number;
  loading_state: boolean;
  profile: null | User;
  predicted_matches: Prediction[];
  // is_mini_app: boolean;
  loaded: boolean;
  is_registered: boolean;
  show_register_modal: boolean;
  connected_address: string | null;
  reward: string;
  connect_calldata: ConnectCalldata | null;
}

// Define the initial state using that type
const initialState: IAppState = {
  leaderboard: [],
  matches: {
    live: [],
    virtual: [],
  },
  predicting: false,
  predicted_matches: [],
  loaded: false,
  prediction_history: [],
  is_registered: false,
  current_round: 0,
  show_register_modal: false,
  total_rounds: 0,
  loading_state: true,
  claimingReward: false,
  profile: null,
  // is_mini_app: false,
  connected_address: null,
  reward: "0",
  connect_calldata: null,
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

    reset: (state) => {
      state.profile = null;
      state.prediction_history = [];
      state.connected_address = null;
      state.connect_calldata = null;
      (state.reward = "0"), (state.is_registered = false);
      state.show_register_modal = false;
    },

    removeUser: (state, action: PayloadAction<string>) => {
      const filter = state.leaderboard.filter(
        (ft) =>
          parseInt(ft.user.address ?? "0x0", 16) !==
          parseInt(action.payload!, 16)
      );

      state.leaderboard = filter;
      state.profile = {
        address: state.profile?.address,
      };
    },

    addLeaderboard: (state, action: PayloadAction<LeaderboardProp>) => {
      if (action.payload.user.address) {
        const filter = state.leaderboard.filter(
          (ft) =>
            parseInt(ft.user.address ?? "0x0", 16) !==
            parseInt(action.payload.user.address!, 16)
        );

        state.leaderboard = [...filter, action.payload];
      }
      state.profile = {
        ...state.profile,
        username: action.payload.user.username,
        id: action.payload.user.id,
        address: action.payload.user?.address,
        point: {
          point: 0,
          rank: state.leaderboard.length,
        },
      };
    },

    // updateMatches: (state, action: PayloadAction<MatchData[]>) => {
    //   const updated_matches = [];

    //   for (let i = 0; i < state.matches.length; i++) {
    //     const match_collection = state.matches[i];

    //     for (let j = 0; j < match_collection.length; j++) {
    //       const match = match_collection[j];

    //       const find = action.payload.find(
    //         (fd) =>
    //           fd.details.fixture.id.toString().trim().toLowerCase() ===
    //           match.details.fixture.id.toString().trim().toLowerCase()
    //       );

    //       if (find) {
    //         updated_matches.push({
    //           ...find,
    //           predicted: match.predicted,
    //           predictions: match.predictions,
    //         });
    //       } else {
    //         updated_matches.push(match);
    //       }
    //     }
    //   }

    //   state.matches = groupMatchesByDate(updated_matches);
    // },

    bulkSetVirtualMatches: (
      state,
      action: PayloadAction<GroupedVirtualMatches[]>
    ) => {
      state.matches.virtual = action.payload;
    },

    setPredictionStatus: (state, action: PayloadAction<boolean>) => {
      state.predicting = action.payload;
    },

    setClaimingRewardStatus: (state, action: PayloadAction<boolean>) => {
      state.claimingReward = action.payload;
    },

    updateVirtualMatches: (state, action: PayloadAction<MatchData[]>) => {
      const newMatches = action.payload;

      newMatches.forEach((match) => {
        const matchDate = match.details.fixture.date;
        const matchLeague = match.details.league.league;

        // Find existing group
        const existingGroup = state.matches.virtual.find(
          (group) =>
            new Date(group.date).getTime() === matchDate &&
            group.league === matchLeague
        );

        if (existingGroup) {
          // Check if match already exists
          const matchIndex = existingGroup.matches.findIndex(
            (m) => m.details.fixture.id === match.details.fixture.id
          );

          if (matchIndex !== -1) {
            // Update existing match
            console.log("updated haha");
            existingGroup.matches[matchIndex] = {
              ...match,
              prediction: existingGroup.matches[matchIndex].prediction,
            };
          } else {
            // Add new match
            existingGroup.matches.push(match);
          }
        } else {
          // Add new group
          //  state..push({
          //    date: matchDate,
          //    league: matchLeague,
          //    matches: [match],
          //  });
        }
      });
      // state.matches.virtual = action.payload;
    },

    bulkAddVirtualMatches: (
      state,
      action: PayloadAction<GroupedVirtualMatches[]>
    ) => {
      // for (let i = 0; i < action.payload.length; i++) {
      //   const element = action.payload[i];

      // }
      // state.matches.virtual = [...state.matches.virtual, ...action.payload];
      state.matches.virtual = Array.from(
        new Map(
          [...state.matches.virtual, ...action.payload].map((match) => [
            match.date,
            match,
          ])
        ).values()
      );
    },

    setReward: (state, action: PayloadAction<string>) => {
      state.reward = action.payload;
    },

    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.loaded = action.payload;
    },

    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.is_registered = action.payload;
    },

    removeVirtualMatchGroup: (state, action: PayloadAction<string>) => {
      const new_state = state.matches.virtual.filter(
        (ft) => ft.date !== action.payload
      );

      const endedMatches = state.matches.virtual
        .filter((ft) => ft.date === action.payload)
        .map((mp) => mp.matches)
        .flat();

      for (let i = 0; i < endedMatches.length; i++) {
        const endedMatch = endedMatches[i];
        const prediction_history = state.prediction_history.flat();
        const find = prediction_history.find(
          (fd) => fd.match_.id === endedMatch.details.fixture.id
        );
        if (find) {
          const newHistory: UserPrediction[] = prediction_history.map((mp) => {
            if (mp.match_.id === find.match_.id) {
              return {
                ...mp,
                match_: {
                  ...mp.match_,
                  home: {
                    ...mp.match_.home,
                    goals: {
                      Some: Number(endedMatch.details.goals?.home),
                    },
                  },
                  away: {
                    ...mp.match_.away,
                    goals: {
                      Some: Number(endedMatch.details.goals?.away),
                    },
                  },
                },
              };
            }
            return mp;
          });
          const grouped = groupMatchesByRound(newHistory);
          state.prediction_history = grouped;
        }
      }
      if (endedMatches.length) {
        state.matches.virtual = new_state;
      }
    },

    setConnectedAddress: (state, action: PayloadAction<any>) => {
      state.connected_address = action.payload;
    },

    setShowRegisterModal: (state, action: PayloadAction<boolean>) => {
      state.show_register_modal = action.payload;
    },

    setPredictionHistory: (state, action: PayloadAction<UserPrediction[]>) => {
      const flat = state.prediction_history.flat();
      const joined = [...action.payload, ...flat];
      const grouped = groupMatchesByRound(joined);
      state.prediction_history = grouped;
    },

    initializePredictionHistory: (
      state,
      action: PayloadAction<UserPrediction[]>
    ) => {
      const grouped = groupMatchesByRound(action.payload);
      state.prediction_history = grouped;
    },

    makePrediction: (
      state,
      action: PayloadAction<
        {
          date: Number;
          league: string;
          match_id: string;
          key: string;
          id: string;
        }[]
      >
    ) => {
      if (state.predicting) return;
      for (let i = 0; i < action.payload.length; i++) {
        const element = action.payload[i];
        const existingGroup = state.matches.virtual.find(
          (group) =>
            new Date(group.date).getTime() === element.date &&
            group.league === element.league
        );

        if (existingGroup) {
          // Check if match already exists
          const matchIndex = existingGroup.matches.findIndex(
            (m) => m.details.fixture.id === element.match_id
          );

          if (matchIndex !== -1) {
            // Update existing match
            // console.log("updated haha");
            existingGroup.matches[matchIndex] = {
              ...existingGroup.matches[matchIndex],
              prediction: {
                key:
                  existingGroup.matches[matchIndex].prediction === element.key
                    ? undefined
                    : element.key,
                id: element.id,
              },
            };
          }
        }
      }
    },

    clearPredictions: (state) => {
      const matches = state.matches.virtual
        .map((mp) => mp.matches)
        .flat()
        .map((mp) => ({ ...mp, prediction: undefined }));
      state.matches.virtual = groupVirtualMatches(matches);
    },

    submitPrediction: (state) => {
      const matches = state.matches.virtual
        .map((mp) => mp.matches)
        .flat()
        .map((mp) => {
          if (mp.prediction) {
            return { ...mp, predicted: true };
          }
          return mp;
        });
      state.matches.virtual = groupVirtualMatches(matches);
    },

    removePredictions: (
      state,
      action: PayloadAction<
        { date: Number; league: string; match_id: string }[]
      >
    ) => {
      for (let i = 0; i < action.payload.length; i++) {
        const element = action.payload[i];
        const existingGroup = state.matches.virtual.find(
          (group) =>
            new Date(group.date).getTime() === element.date &&
            group.league === element.league
        );

        if (existingGroup) {
          // Check if match already exists
          const matchIndex = existingGroup.matches.findIndex(
            (m) => m.details.fixture.id === element.match_id
          );

          if (matchIndex !== -1) {
            // Update existing match
            console.log("updated haha");
            existingGroup.matches[matchIndex] = {
              ...existingGroup.matches[matchIndex],
              prediction: undefined,
            };
          }
        }
      }
    },

    updateLeaderboardImages: (
      state,
      action: PayloadAction<
        { username: string; profile_picture: string; id: string }[]
      >
    ) => {
      const new_leaderboard = state.leaderboard.map((mp) => {
        const find = action.payload.find(
          (fd) =>
            fd.id.toString().toLowerCase() ===
            mp.user.id?.toString()?.toLocaleLowerCase()
        );
        if (find) {
          return {
            ...mp,
            user: {
              ...mp.user,
              username: find.username,
              profile_picture: find.profile_picture,
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

    clearPredictedMatches: (state) => {
      state.predicted_matches = [];
    },

    setPredictions: (
      state,
      action: PayloadAction<Prediction[] | undefined>
    ) => {
      const flat_matches = state.matches.virtual.map((mp) => mp.matches).flat();
      if (flat_matches.length === 0) {
        state.predicted_matches = action.payload!;
        return;
      }

      const appended = flat_matches.map((mp) => {
        const find = (action.payload || state.predicted_matches).find(
          (fd) =>
            fd.prediction_type.variant.Multiple?.match_id ===
              mp.details.fixture.id ||
            fd.prediction_type.variant.Single?.match_id ===
              mp.details.fixture.id
        );

        if (find) {
          return {
            ...mp,
            predicted: true,
            prediction: {
              key: getTagName(find.odd.Some?.tag ?? ""),
              id:
                find.prediction_type.variant.Multiple?.odd ||
                find.prediction_type.variant.Single?.odd,
            },
          };
        }
        return mp;
      });

      state.matches.virtual = groupVirtualMatches(appended);
      // state.predicted_matches = [];
    },

    setCalldata: (state, action: PayloadAction<ConnectCalldata | null>) => {
      if (!action.payload) {
        state.connect_calldata = null;
        return;
      }
      if (action.payload.type !== "none") {
        state.connect_calldata = action.payload;
      } else {
        state.connect_calldata = null;
      }
    },

    // updatePredictionState: (
    //   state,
    //   action: PayloadAction<
    //     {
    //       matchId: string;
    //       keyIndex: number;
    //       prediction: {
    //         prediction: string;
    //         stake: string;
    //       };
    //     }[]
    //   >
    // ) => {
    //   for (let i = 0; i < action.payload.length; i++) {
    //     const element = action.payload[i];
    //     const matchId = element.matchId;
    //     const keyIndex = element.keyIndex;
    //     const prediction = element.prediction;
    //     if (keyIndex < state.matches.length && state.matches[keyIndex].length) {
    //       const newMatchesConstruct = state.matches[keyIndex].map((mp) => {
    //         if (mp.details.fixture.id.toString() === matchId.toString()) {
    //           return { ...mp, predicted: true, predictions: [{ prediction }] };
    //         }
    //         return mp;
    //       });
    //       state.matches[keyIndex] = newMatchesConstruct;
    //     }
    //   }
    // },

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
  bulkSetVirtualMatches,
  setRounds,
  // updatePredictionState,
  setLoadingState,
  update_profile,
  setConnectedAddress,
  setPredictions,
  setLoaded,
  updateVirtualMatches,
  updateLeaderboardImages,
  setShowRegisterModal,
  setIsRegistered,
  addLeaderboard,
  removeVirtualMatchGroup,
  bulkAddVirtualMatches,
  clearPredictedMatches,
  // updateMatches,
  reset,
  setReward,
  makePrediction,
  setCalldata,
  clearPredictions,
  removePredictions,
  submitPrediction,
  setPredictionHistory,
  initializePredictionHistory,
  setPredictionStatus,
  removeUser,
  setClaimingRewardStatus,
} = appSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default appSlice.reducer;
