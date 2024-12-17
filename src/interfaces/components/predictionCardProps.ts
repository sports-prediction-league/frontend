import { MatchData } from "src/state/slices/appSlice";

export interface IPredictionCardProps {
  match: MatchData;
  keyIndex: number;
  predicting: boolean;
  onChangePrediction: (matchId: string, value: any) => void;
  onStakeClick: () => void;
  onSeeStatsClick: () => void;
  onExplorePredictionsClick: () => void;
}
