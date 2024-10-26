import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { MatchData } from "src/state/slices/appSlice";
import { twMerge } from "tailwind-merge";

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_RENDER_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export function formatDateNative(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // e.g., 'Sat'
    month: "long", // e.g., 'June'
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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getGoalRange(score: number[]) {
  const totalGoals = score[0] + score[1];
  return totalGoals <= 2 ? "0-2" : "3+";
}

export function calculateScore(
  goals: { home: string; away: string },
  prediction: string
): number {
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
    goals.home === home &&
    goals.away === away &&
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

export const CONTRACT_ADDRESS =
  "0x48c4e3a53443511013f9ce6d697f7b59509d91f336f1e5c46db2afa817d8cfa";
