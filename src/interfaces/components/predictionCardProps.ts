export interface IPredictionCardProps {
    title: string;
    subtitle: string;
    team1Name: string;
    team1Score: number;
    team2Name: string;
    team2Score: number;
    stakeAmount: string;
    onStakeClick: () => void;
    onSeeStatsClick: () => void;
    onExplorePredictionsClick: () => void;
}
