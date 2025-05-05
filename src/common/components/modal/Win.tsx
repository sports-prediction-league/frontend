import { useState, useEffect } from 'react';
import { Trophy, Share2 } from 'lucide-react';
import ShareOptions from './ShareOptions';
import { useTheme } from '../../../context/ThemeContext';
import useEscapeKey from '../../../lib/useEscapeKey';

interface WinModalProps {
    rank: string;
    isOpen?: boolean;
    onClose?: () => void;
    shareText: string;
    // shareUrl?: string;
}

export default function WinModal({
    rank,
    isOpen,
    onClose = () => { },
    shareText,
    // shareUrl = window.location.href
}: WinModalProps) {

    const { isDark: isDarkMode, } = useTheme();
    // const [visible, setVisible] = useState(isOpen);
    const [beams, setBeams] = useState<any[]>([]);
    const [showShareOptions, setShowShareOptions] = useState(false);

    // Format share text with actual points
    // const formattedShareText = shareText.replace('{points}', points.toString());

    // Colors configuration based on mode
    const colors = {
        background: isDarkMode ? '#042822' : '#FFFFFF', // Dark: spl-green-500, Light: spl-white
        backgroundGlow: isDarkMode
            ? 'radial-gradient(circle, #2D947A 0%, #031614 70%)'
            : 'radial-gradient(circle, #4EFFD51A 0%, #FFFFFF 70%)', // Dark: spl-green variants, Light: spl-green-200 variant
        text: {
            primary: isDarkMode ? '#FFFFFF' : '#042822', // Dark: spl-white, Light: spl-green-500
            secondary: isDarkMode ? '#2D947A' : '#00644C', // Dark: spl-green-100, Light: spl-green-300
            highlight: '#FBAE0C' // spl-orange for both modes
        },
        button: {
            primary: {
                background: isDarkMode
                    ? 'linear-gradient(to right, #2D947A, #00644C)'
                    : 'linear-gradient(to right, #2D947A, #4EFFD51A)', // Different gradients for modes
                text: isDarkMode ? '#FFFFFF' : '#031614' // Dark: spl-white, Light: spl-green-600
            },
            secondary: {
                background: isDarkMode ? '#031614' : '#F5F5F5',
                text: isDarkMode ? '#2D947A' : '#00644C'
            }
        },
        trophy: {
            background: 'linear-gradient(45deg, #FBAE0C, #FBAE0C99)', // spl-orange for both
            icon: isDarkMode ? '#FFFFFF' : '#FFFFFF' // spl-white for both
        },
        beams: '#FBAE0C', // spl-orange for both
        modalOverlay: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)'
    };

    // Generate light beams
    useEffect(() => {
        const numberOfBeams = 12;
        const generatedBeams = [];

        for (let i = 0; i < numberOfBeams; i++) {
            generatedBeams.push(
                <div
                    key={i}
                    className="absolute h-32 w-1 opacity-60 blur-sm origin-bottom"
                    style={{
                        transform: `rotate(${i * (360 / numberOfBeams)}deg)`,
                        animation: `pulse 1.5s infinite alternate ${i * 0.1}s`,
                        backgroundColor: colors.beams
                    }}
                />
            );
        }

        setBeams(generatedBeams);
    }, [isDarkMode, colors.beams]);

    // Close modal function
    const handleClose = () => {
        // setVisible(false);
        if (!showShareOptions) {

            onClose();
        }
    };

    // Toggle share options
    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };

    useEscapeKey(() => {
        if (showShareOptions) {
            setShowShareOptions(false)
        }
    })

    if (!isOpen) return null;



    return (
        <div onClick={() => { if (showShareOptions) { setShowShareOptions(false) } }} className="fixed inset-0 flex items-center px-2 justify-center z-50 animate-fadeIn"
            style={{ backgroundColor: colors.modalOverlay }}>
            <div className="rounded-2xl p-8 shadow-2xl w-[30rem] text-center relative overflow-hidden"
                style={{ backgroundColor: colors.background }}>

                {/* Animated background glow */}
                <div className="absolute inset-0 opacity-20 animate-pulse"
                    style={{ background: colors.backgroundGlow }}></div>

                {/* Trophy with light beams */}
                <div className="relative flex justify-center mb-6 mt-4">
                    <div className="relative flex items-center justify-center h-32 w-32">
                        {beams}
                        <div className="relative z-10 rounded-full p-6 shadow-lg animate-float"
                            style={{ background: colors.trophy.background }}>
                            <Trophy size={56} style={{ color: colors.trophy.icon }} />
                        </div>
                    </div>
                </div>

                {/* Congratulations text */}
                <h2 className="md:text-3xl text-2xl font-bold mb-2" style={{ color: colors.text.primary }}>
                    Congratulations!
                </h2>
                <p className="text-xl font-semibold mb-6" style={{ color: colors.text.secondary }}>
                    You've ranked up to <span className="text-2xl" style={{ color: colors.text.highlight }}>
                        #{rank}
                    </span>!
                </p>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleClose}
                        className="font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:opacity-90 flex-1"
                        style={{
                            background: colors.button.primary.background,
                            color: colors.button.primary.text
                        }}
                    >
                        Awesome!
                    </button>

                    <button
                        onClick={toggleShareOptions}
                        className="font-bold py-3 px-4 outline-none rounded-lg transition-all duration-200 shadow-md hover:opacity-90"
                        style={{
                            background: colors.button.secondary.background,
                            color: colors.button.secondary.text
                        }}
                    >
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Share options component */}
                {showShareOptions && (
                    <ShareOptions
                        text={shareText}
                        // url={shareUrl}
                        isDarkMode={isDarkMode}
                        className="absolute w-64 left-1/2 bottom-10 transform -translate-x-1/2"
                        style={{
                            // top: '100%',
                            marginTop: '-70px',
                            zIndex: 20
                        }}
                    />
                )}

                {/* Confetti particles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    {Array.from({ length: 30 }).map((_, i) => {
                        // Different confetti colors based on mode
                        const confettiColors = isDarkMode
                            ? [colors.text.highlight, colors.text.secondary, '#FFFFFF']
                            : [colors.text.highlight, colors.text.secondary, colors.text.primary];

                        return (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full opacity-70"
                                style={{
                                    backgroundColor: confettiColors[i % 3],
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `fall ${2 + Math.random() * 4}s linear ${Math.random() * 2}s infinite`
                                }}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Add CSS animations */}
            <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; height: 24px; }
          100% { opacity: 0.8; height: 32px; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s forwards;
        }
      `}</style>
        </div>
    );
}