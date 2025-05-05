import { adventurer } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import axios from "axios";
import {
  GroupedVirtualMatches,
  MatchData,
  UserPrediction,
} from "../state/slices/appSlice";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_RENDER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const parseUnits = (
  value: string,
  decimals: number = TOKEN_DECIMAL
): bigint => {
  const [integerPart, fractionalPart = ""] = value.split(".");

  // Pad fractional part to the right with zeros up to `decimals`
  const paddedFraction = fractionalPart
    .padEnd(decimals, "0")
    .slice(0, decimals);

  // Combine integer and fractional parts and convert to BigInt
  return BigInt(integerPart + paddedFraction);
};

export const formatUnits = (
  value: string | bigint,
  decimals: number = TOKEN_DECIMAL
): string => {
  const bigValue = BigInt(value); // Convert to BigInt for precision
  const divisor = BigInt(10 ** decimals); // 10^decimals
  const integerPart = bigValue / divisor;
  const fractionalPart = bigValue % divisor;

  // Pad fractional part with leading zeros
  const fractionalString = fractionalPart.toString().padStart(decimals, "0");

  // Remove trailing zeros and return
  return `${integerPart}.${fractionalString}`.replace(/\.?0+$/, "");
};

export function groupMatchesByDate(matches: MatchData[]): MatchData[][] {
  // Use a Map to group matches by the same date
  const groupedMatches = new Map<string, MatchData[]>();

  (matches ?? []).forEach((match) => {
    // Extract the date part (YYYY-MM-DD) from the ISO date string
    const matchDate = new Date(match.details.fixture.date)
      .toISOString()
      .split("T")[0];

    // If the date doesn't exist in the map, create a new array for that date
    if (!groupedMatches.has(matchDate)) {
      groupedMatches.set(matchDate, []);
    }

    // Push the current match into the array corresponding to the matchDate
    groupedMatches.get(matchDate)?.push(match);

    /// SORT
    // groupedMatches
    //   .get(matchDate)
    //   ?.sort(
    //     (a, b) =>
    //       new Date(a.details.fixture.date).getTime() -
    //       new Date(b.details.fixture.date).getTime()
    //   );
  });

  // Convert the map values (arrays of matches) into a two-dimensional array
  return Array.from(groupedMatches.values());
}

export function groupVirtualMatches(
  matches: MatchData[]
): GroupedVirtualMatches[] {
  const groupedMatches = matches.reduce((groups, match) => {
    const date = match.details.fixture.date; // Extract date (ignore time)
    const key = `${date}-${match.details.league.league}`; // Unique key for each date-league group

    if (!groups[key]) {
      groups[key] = {
        date: new Date(date).toISOString(),
        league: match.details.league.league,
        matches: [],
      };
    }

    groups[key].matches.push(match);
    return groups;
  }, {} as Record<string, { date: string; league: string; matches: MatchData[] }>);

  // Step 2: Convert to Array & Sort by Date
  const sortedGroups = Object.values(groupedMatches).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return sortedGroups;
}

export const groupMatchesByRound = (data: UserPrediction[]) => {
  // Create an object to store groups
  const groups: Record<number, UserPrediction[]> = {};

  // Group items by the round value
  data.forEach((item) => {
    const roundValue = item.match_.round.Some;
    if (!roundValue) return;
    // If this round doesn't exist in groups yet, create a new array
    if (!groups[roundValue]) {
      groups[roundValue] = [];
    }

    // Add the current item to its round group
    groups[roundValue].push(item);
  });

  return Object.entries(groups)
    .sort((a: any, b: any) => {
      // Sort by round numbers in descending order (newest first)
      // Extract numbers from strings like "Round 1", "Round 2", etc.
      const roundA = parseInt(a[0].match(/\d+/)?.[0] || 0);
      const roundB = parseInt(b[0].match(/\d+/)?.[0] || 0);
      return roundB - roundA; // Descending order
    })
    .map((entry) => entry[1]); // Keep only the arrays of objects

  // Convert the object of groups into an array of arrays
  // return Object.values(groups);
};

export function formatDateNative(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // e.g., 'Sat'
    month: "short", // e.g., 'June'
    day: "numeric", // e.g., '13'
  };

  // Format the date
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  // Format day suffix (e.g., '13th')
  const day = date.getDate();
  const suffix =
    ["th", "st", "nd", "rd"][
      day % 10 > 3 || Math.floor(day / 10) === 1 ? 0 : day % 10
    ] || "th";
  const formattedDateWithSuffix = `${formattedDate
    .replace(day.toString(), day + suffix)
    .toUpperCase()}`;

  return formattedDateWithSuffix;
}

export function formatTimeNative(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour time format
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  return formatter.format(date);
}

function getGoalRange(score: number[]) {
  const totalGoals = score[0] + score[1];
  return totalGoals <= 2 ? "0-2" : "3+";
}

export function calculateScore(
  goals: { home: string; away: string },
  prediction: string
): number {
  if (!goals.home || !goals.away) return 0;
  let point = 0;
  const home = prediction.split(":")[0];
  const away = prediction.split(":")[1];
  // Calculate the goal range for the actual result and user prediction
  const actualGoalRange = getGoalRange([
    Number(goals.home.toString()),
    Number(goals.away.toString()),
  ]);
  const predictedGoalRange = getGoalRange([
    Number(home.toString().trim()),
    Number(away.toString().trim()),
  ]);

  // Determine if the actual match result is a draw or if one team scored more
  const actualResult =
    goals.home === goals.away
      ? "draw"
      : goals.home > goals.away
      ? "home"
      : "away";
  const predictedResult =
    home === away ? "draw" : home > away ? "home" : "away";

  // 5 Points: Exact score match and correct goal range
  if (
    goals?.home?.toString()?.trim() === home?.trim() &&
    goals?.away?.toString()?.trim() === away?.trim() &&
    actualGoalRange === predictedGoalRange
  ) {
    point = 5; // Exact match
  }
  // 3 Point: Correct match result and goal range, but incorrect exact score
  else if (
    predictedResult === actualResult &&
    actualGoalRange === predictedGoalRange
  ) {
    point = 3; // Correct result and goal range
  }
  // 2 Point: Correct match result only
  else if (predictedResult === actualResult) {
    point = 2; // Correct result but incorrect score and goal range
  }

  return point;
}

export const getTagName = (tag: string): string => {
  let name = "";
  switch (tag) {
    case "1":
      name = "home";
      break;
    case "2":
      name = "away";
      break;

    case "x":
      name = "draw";
      break;
    default:
      break;
  }
  return name;
};

export const checkWin = (
  tag: string,
  scores: { home: number; away: number }
): boolean => {
  let win = false;
  switch (tag) {
    case "1":
      if (scores.home > scores.away) {
        win = true;
      }
      break;
    case "2":
      if (scores.away > scores.home) {
        win = true;
      }
      break;

    case "x":
      if (scores.home === scores.away) {
        win = true;
      }
      break;
    default:
      break;
  }
  return win;
};

export const deserializePredictions = (predictions: UserPrediction[]) => {
  const result: UserPrediction[] = predictions.map((mp) => {
    return {
      ...mp,
      match_: {
        ...mp.match_,
        timestamp: Number(mp.match_.timestamp),
        id: feltToString(mp.match_.id),
        home: {
          id: mp.match_.home.id.toString(),
          goals:
            mp.match_.home.goals.Some != undefined
              ? { Some: Number(mp.match_.home.goals.Some) }
              : { None: true },
        },
        away: {
          id: mp.match_.away.id.toString(),
          goals:
            mp.match_.away.goals.Some != undefined
              ? { Some: Number(mp.match_.away.goals.Some) }
              : { None: true },
        },
        round: mp.match_.round.Some
          ? { Some: Number(mp.match_.round.Some) }
          : { None: true },
        match_type: {
          variant: mp.match_.match_type.variant.Live
            ? { Live: true }
            : { Virtual: true },
        },
      },
      prediction: {
        ...mp.prediction,
        odd: mp.prediction.odd.Some
          ? {
              Some: {
                tag:
                  mp.prediction.odd.Some.tag.toString().length < 3
                    ? mp.prediction.odd.Some.tag.toString()
                    : feltToString(mp.prediction.odd.Some.tag),
                value: Number(mp.prediction.odd.Some.value),
              },
            }
          : { None: true },
        stake: Number(mp.prediction.stake),
        prediction_type: {
          variant: mp.prediction.prediction_type.variant.Multiple
            ? {
                Multiple: {
                  match_id: feltToString(
                    mp.prediction.prediction_type.variant.Multiple.match_id
                  ),
                  pair_id: feltToString(
                    mp.prediction.prediction_type.variant.Multiple.pair_id
                  ),
                  odd: feltToString(
                    mp.prediction.prediction_type.variant.Multiple.odd
                  ),
                },
              }
            : {
                Single: {
                  match_id: feltToString(
                    mp.prediction.prediction_type.variant.Single?.match_id
                  ),
                  odd: feltToString(
                    mp.prediction.prediction_type.variant.Single?.odd
                  ),
                },
              },
        },
      },
    };
  });

  return result;
};

export const feltToString = (felt: any) =>
  felt
    // To hex
    .toString(16)
    // Split into 2 chars
    .match(/.{2}/g)
    // Get char from code
    .map((c: any) => String.fromCharCode(parseInt(c, 16)))
    // Join to a string
    .join("");

export function parse_error(error?: string): string {
  if (!error) {
    return "OOPPS! Something went wrong!";
  }
  const failureReasonMatch = error.match(/Failure reason: .*?\('([^']+)'\)/);

  if (failureReasonMatch && failureReasonMatch[1]) {
    const failureReason = failureReasonMatch[1];
    return failureReason;
  } else {
    return error;
  }
}

export function generateAvatarFromAddress(
  address?: string,
  toString?: boolean
) {
  const avatar = createAvatar(adventurer, {
    seed: `address-${address?.toLowerCase()}`,
  });

  if (toString) {
    return avatar.toString();
  }
  const svg = avatar.toDataUri();

  return svg;
}

export const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS!;
export const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS!;
export const AVNU_API_KEY = import.meta.env.VITE_AVNU_API_KEY!;
export const TOKEN_DECIMAL = 18;
export const MINI_APP_URL = "https://t.me/SPLBot/SPL";
