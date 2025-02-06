import React, { useState, useEffect, useRef } from 'react';

// Previous type definitions remain the same...
type Position = {
    x: number;
    y: number;
};

type GameEvent = {
    time: number;
    type: 'move' | 'goal';
    position: Position;
    team?: 'home' | 'away';
};

type ScoreTarget = {
    home: number;
    away: number;
};

// Game script generator function remains the same...
function generateGameScript(
    duration: number = 120,
    scores: ScoreTarget = { home: 2, away: 2 }
): GameEvent[] {
    const script: GameEvent[] = [];
    const totalGoals = scores.home + scores.away;

    function createSequence(
        startTime: number,
        isHome: boolean,
        shouldScore: boolean,
        maxDuration: number,
        isLastScoring: boolean
    ): { events: GameEvent[], endTime: number } {
        const events: GameEvent[] = [];
        let currentTime = startTime;

        const startX = 30 + Math.random() * 40;
        const startY = 20 + Math.random() * 60;
        const remainingTime = maxDuration - currentTime;

        const minMovements = shouldScore ? 2 : 3;
        const maxMovements = shouldScore ?
            Math.min(5, Math.floor(remainingTime / 2)) :
            Math.min(8, Math.floor(remainingTime / 3));

        const movementCount = Math.max(minMovements,
            Math.min(3 + Math.floor(Math.random() * 3), maxMovements));

        let timePerMove;
        if (shouldScore) {
            const requiredTime = isLastScoring ?
                remainingTime :
                Math.min(remainingTime, 15);
            timePerMove = Math.max(1, requiredTime / (movementCount + 2));
        } else {
            timePerMove = Math.max(1, remainingTime / (movementCount + 1));
        }

        events.push({
            time: currentTime,
            type: 'move',
            position: { x: startX, y: startY }
        });

        for (let i = 1; i < movementCount; i++) {
            currentTime += timePerMove;
            if (currentTime >= maxDuration) break;

            let targetX, targetY;

            if (shouldScore) {
                const progressRatio = i / movementCount;
                targetX = isHome ?
                    startX + (95 - startX) * progressRatio :
                    startX - (startX - 5) * progressRatio;
                targetY = 40 + Math.random() * 20;
            } else {
                const previousX = events[events.length - 1].position.x;
                const previousY = events[events.length - 1].position.y;

                const moveType = Math.random();
                if (moveType < 0.4) {
                    targetX = Math.max(5, Math.min(95, previousX + (Math.random() - 0.5) * 30));
                    targetY = previousY + (Math.random() - 0.5) * 10;
                } else {
                    targetX = Math.max(5, Math.min(95, 20 + Math.random() * 60));
                    targetY = Math.max(5, Math.min(95, 20 + Math.random() * 60));
                }
            }

            events.push({
                time: currentTime,
                type: 'move',
                position: { x: targetX, y: targetY }
            });
        }

        if (shouldScore && currentTime + timePerMove <= maxDuration) {
            currentTime += timePerMove;
            events.push({
                time: currentTime,
                type: 'goal',
                position: { x: isHome ? 95 : 5, y: 50 },
                team: isHome ? 'home' : 'away'
            });

            if (currentTime + timePerMove <= maxDuration) {
                currentTime += timePerMove;
                events.push({
                    time: currentTime,
                    type: 'move',
                    position: { x: 50, y: 50 }
                });
            }
        }

        return { events, endTime: currentTime };
    }

    let currentTime = 0;
    let homeGoalsLeft = scores.home;
    let awayGoalsLeft = scores.away;

    if (totalGoals > 0) {
        const approxTimePerGoal = duration / (totalGoals + 1);

        while (homeGoalsLeft > 0 || awayGoalsLeft > 0) {
            const homeTeamAttacks = Math.random() < homeGoalsLeft / (homeGoalsLeft + awayGoalsLeft);
            const isLastScore = homeGoalsLeft + awayGoalsLeft === 1;

            const sequence = createSequence(
                currentTime,
                homeTeamAttacks,
                true,
                duration,
                isLastScore
            );

            script.push(...sequence.events);

            if (homeTeamAttacks) homeGoalsLeft--;
            else awayGoalsLeft--;

            currentTime = sequence.endTime + Math.min(5, approxTimePerGoal * 0.2);
        }
    }

    while (currentTime < duration) {
        const isHome = Math.random() < 0.5;
        const remainingTime = duration - currentTime;

        if (remainingTime < 3) {
            script.push({
                time: currentTime,
                type: 'move',
                position: { x: 45 + Math.random() * 10, y: 45 + Math.random() * 10 }
            });
            break;
        }

        const sequence = createSequence(currentTime, isHome, false, duration, false);
        script.push(...sequence.events);
        currentTime = sequence.endTime + Math.min(2, remainingTime * 0.1);
    }

    return script
        .filter(event => event.time <= duration)
        .sort((a, b) => a.time - b.time);
}

const SoccerGame = () => {
    const [gameTime, setGameTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState({ home: 0, away: 0 });
    const [gameLog, setGameLog] = useState<string[]>([]);
    const [ball, setBall] = useState({ x: 50, y: 50 });
    const [showGoal, setShowGoal] = useState(false);
    const [scoringTeam, setScoringTeam] = useState<'home' | 'away' | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);

    const isProcessingGoal = useRef(false);
    const lastProcessedTime = useRef(-1);

    // Initialize game events
    useEffect(() => {
        const targetScore = {
            home: Math.floor(Math.random() * 4),
            away: Math.floor(Math.random() * 4)
        };
        const script = generateGameScript(120, targetScore);
        console.log(targetScore)
        console.log(script)
        setGameEvents(script);
    }, []);

    // Game loop with precise event handling
    useEffect(() => {
        if (!isPlaying || isGameOver || gameEvents.length === 0) return;

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

                        // Handle goals
                        if (event.type === 'goal' && event.team && !isProcessingGoal.current) {
                            isProcessingGoal.current = true;
                            setScore(prevScore => ({
                                ...prevScore,
                                [event.team!]: prevScore[event.team!] + 1
                            }));
                            setShowGoal(true);
                            setScoringTeam(event.team);
                            setGameLog(prev => [...prev,
                            `${time}s: GOAL! ${event.team!.toUpperCase()} team scores!`
                            ]);

                            // Reset goal animation after 2 seconds
                            setTimeout(() => {
                                setShowGoal(false);
                                setScoringTeam(null);
                                isProcessingGoal.current = false;
                            }, 2000);
                        } else if (event.type === 'move') {
                            setGameLog(prev => [
                                ...prev,
                                `${time}s: Ball moved to position (${Math.round(event.position.x)}, ${Math.round(event.position.y)})`
                            ]);
                        }
                    });
                }

                lastProcessedTime.current = newTime;
                return newTime;
            });
        }, 1000);

        return () => clearInterval(gameLoop);
    }, [isPlaying, isGameOver, gameEvents]);

    const resetGame = () => {
        const targetScore = {
            home: Math.floor(Math.random() * 4),
            away: Math.floor(Math.random() * 4)
        };
        const script = generateGameScript(120, targetScore);
        console.log(targetScore)
        console.log(script)
        setGameEvents(script);
        setGameTime(0);
        setScore({ home: 0, away: 0 });
        setGameLog([]);
        setBall({ x: 50, y: 50 });
        setShowGoal(false);
        setScoringTeam(null);
        setIsGameOver(false);
        setIsPlaying(false);
        isProcessingGoal.current = false;
        lastProcessedTime.current = -1;
    };

    return (
        <div className="w-1/2 max-w-4xl mx-auto p-4">
            <div className="bg-[#1B4D3E] relative w-full aspect-[3/2] rounded-lg overflow-hidden">
                {/* Field markings */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 border-4 border-white" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white" />
                    <div className="absolute left-1/2 top-1/2 w-24 h-24 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 ml-0.5" />
                    <div className="absolute left-0 top-1/2 w-16 h-32 border-4 border-white -translate-y-1/2" />
                    <div className="absolute right-0 top-1/2 w-16 h-32 border-4 border-white -translate-y-1/2" />
                </div>

                {/* Goal Animation */}
                {showGoal && (
                    <div className="absolute inset-0 flex items-center justify-center z-50">
                        <div className={`text-8xl font-bold ${scoringTeam === 'home' ? 'text-blue-500' : 'text-red-500'} animate-bounce drop-shadow-lg`}>
                            GOAL!
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
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        Home {score.home} - {score.away} Away
                    </div>
                    <div className="text-xl">
                        {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => isGameOver ? resetGame() : setIsPlaying(!isPlaying)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {isGameOver ? 'Reset' : (isPlaying ? 'Pause' : 'Play')}
                        </button>
                    </div>
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