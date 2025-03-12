import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { groupMatchesByDate, groupVirtualMatches } from "src/lib/utils";

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

interface Teams {
  home: Team;
  away: Team;
}

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
  id?: number;
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
  total_rounds: number;
  current_round: number;
  loading_state: boolean;
  profile: null | User;
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
  loaded: false,
  is_registered: false,
  current_round: 0,
  show_register_modal: false,
  total_rounds: 0,
  loading_state: true,
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

    addLeaderboard: (state, action: PayloadAction<LeaderboardProp>) => {
      state.leaderboard.push(action.payload);
      state.profile = {
        ...state.profile,
        username: action.payload.user.username,
        id: action.payload.user.id,
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
            alert("naaaahhh");
            // Add new match
            existingGroup.matches.push(match);
          }
        } else {
          alert("never here");
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
      state.matches.virtual = new_state;
    },

    // setPredictions: (state, action: PayloadAction<Prediction[]>) => {
    //   const new_matches = state.matches.map((mp) => {
    //     return mp.map((mmp) => {
    //       const find = action.payload.find(
    //         (fd) => fd.match_id === mmp.details.fixture.id.toString()
    //       );
    //       if (find) {
    //         return {
    //           ...mmp,
    //           predicted: true,
    //           predictions: [
    //             {
    //               prediction: {
    //                 prediction: `${find.home}:${find.away}`,
    //                 stake: find.stake,
    //               },
    //             },
    //           ],
    //         };
    //       }

    //       return mmp;
    //     });
    //   });

    //   state.matches = new_matches;
    // },

    setConnectedAddress: (state, action: PayloadAction<any>) => {
      state.connected_address = action.payload;
    },

    setShowRegisterModal: (state, action: PayloadAction<boolean>) => {
      state.show_register_modal = action.payload;
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
  // setPredictions,
  setLoaded,
  updateVirtualMatches,
  updateLeaderboardImages,
  setShowRegisterModal,
  setIsRegistered,
  addLeaderboard,
  removeVirtualMatchGroup,
  bulkAddVirtualMatches,
  // updateMatches,
  setReward,
  makePrediction,
  setCalldata,
  clearPredictions,
  removePredictions,
} = appSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default appSlice.reducer;
