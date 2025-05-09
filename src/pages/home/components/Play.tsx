import { useState, useEffect, useRef } from 'react';
import { Teams } from '../../../state/slices/appSlice';

// Previous type definitions remain the same...
type Position = {
    x: number;
    y: number;
};

export type GameEvent = {
    time: number;
    type: 'move' | 'goal' | 'second-half';
    position: Position;
    team?: 'home' | 'away';
};

// type ScoreTarget = {
//     home: number;
//     away: number;
// };

function generateRealisticCommentary(event: GameEvent, gameTime: number, score: { home: number, away: number }): string {
    const minuteStamp = `[${Math.floor(gameTime / 60)}:${(gameTime % 60).toString().padStart(2, '0')}]`;
    const teamName = event.team === 'home' ? 'Blue Team' : 'Red Team';

    const commentaryLibraries = {
        ballMovement: [
            "Probing pass across the midfield.",
            "Tactical repositioning by the players.",
            "Looking for an opening in the defense.",
            "Careful buildup play developing.",
            "Midfielders working to create space.",
            "Intricate passing sequence underway.",
            "Team maintaining possession smartly."
        ],
        goalSetup: [
            "Dangerous attack building up!",
            "Promising move developing...",
            "Attackers pressing high up the pitch!",
            "Midfield creating some real pressure now!",
            "Sensing a potential breakthrough...",
            "Attacking momentum gathering steam!"
        ],
        goalScored: [
            "GOOOAAAALLL! ABSOLUTELY MAGNIFICENT!",
            "STUNNING FINISH! THE CROWD IS ERUPTING!",
            "WHAT A GOAL! PURE FOOTBALLING MAGIC!",
            "INCREDIBLE STRIKE! SIMPLY WORLD-CLASS!",
            "BREAKTHROUGH! THE GOALKEEPER HAD NO CHANCE!",
            "SENSATIONAL! A GOAL THAT WILL BE REMEMBERED!"
        ]
    };

    // Commentary based on ball position and game context
    const x = event.position.x;
    const y = event.position.y;

    const getPositionalContext = () => {
        if (x < 20) return "Defending deep in their own half";
        if (x < 40) return "Building from the back";
        if (x < 60) return "Midfield battle intensifying";
        if (x < 80) return "Pushing into the attacking third";
        return "Threatening the goal area!";
    };

    switch (event.type) {
        case 'move':
            // More nuanced movement commentary
            if (x > 70 && y > 30 && y < 70) {
                return `${minuteStamp} ${commentaryLibraries.goalSetup[Math.floor(Math.random() * commentaryLibraries.goalSetup.length)]} ${getPositionalContext()}`;
            }
            return `${minuteStamp} ${commentaryLibraries.ballMovement[Math.floor(Math.random() * commentaryLibraries.ballMovement.length)]} ${getPositionalContext()}`;

        case 'goal':
            const scoreDifference = Math.abs(score.home - score.away);
            const scoringMomentComments = [
                `${teamName} breaks the deadlock!`,
                scoreDifference === 0 ? "Scores to level the match!" :
                    (scoreDifference === 1 ? "Narrows the gap!" : "Extending their lead convincingly!"),
                "A moment of individual brilliance!"
            ];

            return `${minuteStamp} ${commentaryLibraries.goalScored[Math.floor(Math.random() * commentaryLibraries.goalScored.length)]} ${scoringMomentComments[Math.floor(Math.random() * scoringMomentComments.length)]}`;

        default:
            return `${minuteStamp} Interesting development on the pitch.`;
    }
}

// interface PredictionOdds {
//     homeWin: number;
//     awayWin: number;
//     draw: number;
//     totalGoals: { under: number, over: number };
// }

// function calculatePredictionOdds(): PredictionOdds {
//     // Generate random odds within a realistic range
//     const getRandomOdd = (min = 1.1, max = 6.0) => {
//         return parseFloat((min + Math.random() * (max - min)).toFixed(2));
//     };

//     // Basic match result odds
//     const odds = {
//         homeWin: getRandomOdd(),
//         awayWin: getRandomOdd(),
//         draw: getRandomOdd(),
//         totalGoals: {
//             under: getRandomOdd(),
//             over: getRandomOdd()
//         },
//         bothTeamsToScore: {
//             yes: getRandomOdd(1.5, 2.5), // Odds for both teams scoring
//             no: getRandomOdd(1.5, 2.5)   // Odds for a clean sheet
//         },
//         firstTeamToScore: {
//             home: getRandomOdd(1.5, 2.5),
//             away: getRandomOdd(1.5, 2.5),
//             noGoal: getRandomOdd(3.0, 5.0) // If no team scores
//         },
//         halftimeFulltime: {
//             homeHome: getRandomOdd(2.0, 4.5),  // Home leads at HT and wins FT
//             homeDraw: getRandomOdd(4.0, 6.5), // Home leads HT but Draw FT
//             homeAway: getRandomOdd(7.0, 12.0),// Home leads HT, Away wins FT
//             drawHome: getRandomOdd(3.5, 5.5), // Draw HT, Home wins FT
//             drawDraw: getRandomOdd(3.0, 4.5), // Draw HT, Draw FT
//             drawAway: getRandomOdd(3.5, 5.5), // Draw HT, Away wins FT
//             awayHome: getRandomOdd(7.0, 12.0),// Away leads HT, Home wins FT
//             awayDraw: getRandomOdd(4.0, 6.5), // Away leads HT, Draw FT
//             awayAway: getRandomOdd(2.0, 4.5)  // Away leads HT and wins FT
//         },
//         handicap: {
//             homeMinus1: getRandomOdd(2.0, 3.5), // Home wins by 2+ goals
//             awayPlus1: getRandomOdd(1.8, 3.2),  // Away loses by max 1 goal
//             homeMinus2: getRandomOdd(3.5, 5.5), // Home wins by 3+ goals
//             awayPlus2: getRandomOdd(2.5, 4.5)   // Away loses by max 2 goals
//         }
//     };

//     return odds;
// }

// function generateGameScript(
//     duration: number = 120,
//     scores: ScoreTarget = { home: 2, away: 2 }
// ): {
//     events: GameEvent[],
//     odds: PredictionOdds
// } {
//     const script = generateBaseGameScript(duration, scores);
//     const odds = calculatePredictionOdds();

//     return {
//         events: script,
//         odds
//     };
// }

// Game script generator function remains the same...
// function generateBaseGameScript(
//     duration: number = 120,
//     scores: ScoreTarget = { home: 2, away: 2 }
// ): GameEvent[] {
//     const script: GameEvent[] = [];
//     const totalGoals = scores.home + scores.away;
//     const halfTime = duration / 2;

//     // Add second half event
//     script.push({
//         time: halfTime,
//         type: 'second-half',
//         position: {
//             x: 50,
//             y: 50
//         }
//     });

//     function createSequence(
//         startTime: number,
//         isHome: boolean,
//         shouldScore: boolean,
//         maxDuration: number,
//         isLastScoring: boolean
//     ): { events: GameEvent[], endTime: number } {
//         const events: GameEvent[] = [];
//         let currentTime = startTime;

//         const startX = 30 + Math.random() * 40;
//         const startY = 20 + Math.random() * 60;
//         const remainingTime = maxDuration - currentTime;

//         const minMovements = shouldScore ? 2 : 3;
//         const maxMovements = shouldScore ?
//             Math.min(5, Math.floor(remainingTime / 2)) :
//             Math.min(8, Math.floor(remainingTime / 3));

//         const movementCount = Math.max(minMovements,
//             Math.min(3 + Math.floor(Math.random() * 3), maxMovements));

//         let timePerMove;
//         if (shouldScore) {
//             const requiredTime = isLastScoring ?
//                 remainingTime :
//                 Math.min(remainingTime, 15);
//             timePerMove = Math.max(1, requiredTime / (movementCount + 2));
//         } else {
//             timePerMove = Math.max(1, remainingTime / (movementCount + 1));
//         }

//         events.push({
//             time: currentTime,
//             type: 'move',
//             position: { x: startX, y: startY }
//         });

//         for (let i = 1; i < movementCount; i++) {
//             currentTime += timePerMove;
//             if (currentTime >= maxDuration) break;

//             let targetX, targetY;

//             if (shouldScore) {
//                 const progressRatio = i / movementCount;
//                 targetX = isHome ?
//                     startX + (95 - startX) * progressRatio :
//                     startX - (startX - 5) * progressRatio;
//                 targetY = 40 + Math.random() * 20;
//             } else {
//                 const previousX = events[events.length - 1].position.x;
//                 const previousY = events[events.length - 1].position.y;

//                 const moveType = Math.random();
//                 if (moveType < 0.4) {
//                     targetX = Math.max(5, Math.min(95, previousX + (Math.random() - 0.5) * 30));
//                     targetY = previousY + (Math.random() - 0.5) * 10;
//                 } else {
//                     targetX = Math.max(5, Math.min(95, 20 + Math.random() * 60));
//                     targetY = Math.max(5, Math.min(95, 20 + Math.random() * 60));
//                 }
//             }

//             events.push({
//                 time: currentTime,
//                 type: 'move',
//                 position: { x: targetX, y: targetY }
//             });
//         }

//         if (shouldScore && currentTime + timePerMove <= maxDuration) {
//             currentTime += timePerMove;
//             events.push({
//                 time: currentTime,
//                 type: 'goal',
//                 position: { x: isHome ? 95 : 5, y: 50 },
//                 team: isHome ? 'home' : 'away'
//             });

//             if (currentTime + timePerMove <= maxDuration) {
//                 currentTime += timePerMove;
//                 events.push({
//                     time: currentTime,
//                     type: 'move',
//                     position: { x: 50, y: 50 }
//                 });
//             }
//         }

//         return { events, endTime: currentTime };
//     }

//     let currentTime = 0;
//     let homeGoalsLeft = scores.home;
//     let awayGoalsLeft = scores.away;

//     if (totalGoals > 0) {
//         const approxTimePerGoal = duration / (totalGoals + 1);

//         while (homeGoalsLeft > 0 || awayGoalsLeft > 0) {
//             const homeTeamAttacks = Math.random() < homeGoalsLeft / (homeGoalsLeft + awayGoalsLeft);
//             const isLastScore = homeGoalsLeft + awayGoalsLeft === 1;

//             // If we're approaching half time, delay the sequence to after half time
//             if (currentTime < halfTime && currentTime + 15 > halfTime) {
//                 currentTime = halfTime + 5;
//             }

//             const sequence = createSequence(
//                 currentTime,
//                 homeTeamAttacks,
//                 true,
//                 duration,
//                 isLastScore
//             );

//             script.push(...sequence.events);

//             if (homeTeamAttacks) homeGoalsLeft--;
//             else awayGoalsLeft--;

//             currentTime = sequence.endTime + Math.min(5, approxTimePerGoal * 0.2);
//         }
//     }

//     while (currentTime < duration) {
//         const isHome = Math.random() < 0.5;
//         const remainingTime = duration - currentTime;

//         // If we're approaching half time, delay the sequence to after half time
//         if (currentTime < halfTime && currentTime + 10 > halfTime) {
//             currentTime = halfTime + 5;
//             continue;
//         }

//         if (remainingTime < 3) {
//             script.push({
//                 time: currentTime,
//                 type: 'move',
//                 position: { x: 45 + Math.random() * 10, y: 45 + Math.random() * 10 }
//             });
//             break;
//         }

//         const sequence = createSequence(currentTime, isHome, false, duration, false);
//         script.push(...sequence.events);
//         currentTime = sequence.endTime + Math.min(2, remainingTime * 0.1);
//     }

//     return script
//         .filter(event => event.time <= duration)
//         .sort((a, b) => a.time - b.time);
// }

interface Props {
    gameEvent?: GameEvent[],
    teams?: Teams,
    timestamp: number

}

const SoccerGame = ({ gameEvent, teams, timestamp }: Props) => {
    const [gameTime, setGameTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState({ home: 0, away: 0 });
    const [gameLog, setGameLog] = useState<string[]>([]);
    const [ball, setBall] = useState({ x: 50, y: 50 });
    const [showGoal, setShowGoal] = useState(false);
    const [showHalfTime, setShowHalfTime] = useState(false);
    const [scoringTeam, setScoringTeam] = useState<'home' | 'away' | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

    const isProcessingGoal = useRef(false);
    const lastProcessedTime = useRef(-1);

    // Initialize game events
    useEffect(() => {
        // const targetScore = {
        //     home: Math.floor(Math.random() * 7),
        //     away: Math.floor(Math.random() * 7)
        // };
        // const script = generateGameScript(120, targetScore);
        // console.log(targetScore)
        // console.log(script)
        if (gameEvents.length === 0) {
            if (gameEvent) {
                setGameEvents(gameEvent);
                setIsPlaying(true)
            }
        }
    }, [gameEvent]);

    // Game loop with precise event handling
    useEffect(() => {
        if (!isPlaying || isGameOver || gameEvents.length === 0) return;

        const now = Date.now();
        if (now > timestamp) {
            const timeInMinutes = (now - timestamp) / 1000;
            for (let i = 0; i < (gameEvent ?? []).length; i++) {
                const event = (gameEvent ?? [])[i];
                if (event.time <= timeInMinutes) {
                    if (event.type === "goal") {
                        setScore(prevScore => ({
                            ...prevScore,
                            [event.team!]: prevScore[event.team!] + 1
                        }));
                    }
                    const commentaryLine = generateRealisticCommentary(event, Math.round(event.time), score);
                    setGameLog(prev => [...prev.slice(-5), commentaryLine]);
                    setGameTime(Math.round(event.time));
                    lastProcessedTime.current = Math.round(event.time);
                }

            }

        }
        const gameLoop = setInterval(() => {
            setGameTime(prev => {
                const newTime = prev + 1;

                if (newTime > 120) {
                    setIsPlaying(false);
                    setIsGameOver(true);
                    setGameLog(prev => [...prev, "Game Over!"]);
                    return 120;
                }

                // Process all events that occurred since last update
                for (let time = lastProcessedTime.current + 1; time <= newTime; time++) {
                    const eventsAtTime = gameEvents.filter(event =>
                        Math.floor(event.time) === time
                    );

                    eventsAtTime.forEach(event => {
                        // Update ball position
                        setBall(event.position);
                        const commentaryLine = generateRealisticCommentary(event, newTime, score);
                        setGameLog(prev => [...prev.slice(-5), commentaryLine]);

                        // Handle second half
                        if (event.type === 'second-half') {
                            setShowHalfTime(true);
                            setTimeout(() => {
                                setShowHalfTime(false);
                            }, 3000);
                        }

                        // Handle goals
                        if (event.type === 'goal' && event.team && !isProcessingGoal.current) {
                            isProcessingGoal.current = true;
                            setScore(prevScore => ({
                                ...prevScore,
                                [event.team!]: prevScore[event.team!] + 1
                            }));
                            setShowGoal(true);
                            setScoringTeam(event.team);

                            setTimeout(() => {
                                setShowGoal(false);
                                setScoringTeam(null);
                                isProcessingGoal.current = false;
                            }, 2000);
                        }
                    });
                }

                lastProcessedTime.current = newTime;
                return newTime;
            });
        }, 1000);

        return () => clearInterval(gameLoop);
    }, [isPlaying, isGameOver, gameEvents]);

    // const resetGame = () => {
    //     const targetScore = {
    //         away: Math.floor(Math.random() * 7),
    //         home: Math.floor(Math.random() * 7),
    //     };
    //     const script = generateGameScript(120, targetScore);
    //     console.log(targetScore)
    //     console.log(script)
    //     setGameEvents(script.events);
    //     setGameTime(0);
    //     setScore({ home: 0, away: 0 });
    //     setGameLog([]);
    //     setBall({ x: 50, y: 50 });
    //     setShowGoal(false);
    //     setScoringTeam(null);
    //     setIsGameOver(false);
    //     setIsPlaying(false);
    //     isProcessingGoal.current = false;
    //     lastProcessedTime.current = -1;
    // };

    return (
        <div className="w-full  mx-auto p-4">
            <div className="grid grid-cols-2 gap-4 dark:text-white/80 text-black/80 items-center justify-between">
                <div className="flex items-center justify-start">
                    <p className='line-clamp-1 font-bold md:text-xl text-lg'>{teams?.home.name}</p>
                </div>
                <div className="flex items-center justify-end">
                    <p className='line-clamp-1 font-bold md:text-xl text-lg'>{teams?.away.name}</p>
                </div>
            </div>
            <div className="bg-[#1B4D3E] relative w-full aspect-[3/2] rounded-lg overflow-hidden">
                {/* Field markings */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 border-4 border-white" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white" />
                    <div className="absolute left-1/2 top-1/2 md:w-24 w-16 md:h-24 h-16 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 ml-0.5" />
                    <div className="absolute left-0 top-1/2 md:w-16 w-12 md:h-32 h-20 border-4 border-white -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 md:w-16 w-12 md:h-32 h-20 border-4 border-white -translate-y-1/2" />
                </div>

                {/* Second Half Animation */}
                {showHalfTime && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="md:text-6xl text-3xl font-bold text-white animate-fade-in-out">
                            SECOND HALF
                        </div>
                    </div>
                )}


                {Date.now() < timestamp && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                        <div className="md:text-6xl text-3xl font-bold text-white animate-fade-in-out">
                            Match Not started
                        </div>
                    </div>
                )}

                {/* Goal Animation */}
                {showGoal && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className={`md:text-8xl text-4xl font-bold ${scoringTeam === 'home' ? 'text-blue-500' : 'text-red-500'} animate-bounce drop-shadow-lg`}>
                            GOAL!
                        </div>
                    </div>
                )}

                {isGameOver && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className={`md:text-6xl text-4xl font-bold ${scoringTeam === 'home' ? 'text-blue-500' : 'text-red-500'} animate-bounce drop-shadow-lg`}>
                            Game Over!
                        </div>
                    </div>
                )}

                {/* Ball */}
                <div
                    className="absolute w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2 shadow-lg border border-gray-400"
                    style={{
                        left: `${ball.x}%`,
                        top: `${ball.y}%`,
                    }}
                />
            </div>

            {/* Controls and Info */}
            <div className="mt-4 space-y-4">
                <div className="flex dark:text-white/80 text-black justify-between items-center">
                    <div className="md:text-2xl text-lg font-bold">
                        Home {score.home} - {score.away} Away
                    </div>
                    <div className="md:text-xl text-sm">
                        {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                    </div>
                    {/* <div className="space-x-2">
                        <button
                            onClick={() => isGameOver ? resetGame() : setIsPlaying(!isPlaying)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {isGameOver ? 'Reset' : (isPlaying ? 'Pause' : 'Play')}
                        </button>
                    </div> */}
                </div>

                <div className="h-32 overflow-y-auto bg-gray-100 p-2 rounded">
                    {gameLog.slice(-5).map((log, idx) => (
                        <div key={idx} className="text-sm">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SoccerGame;
