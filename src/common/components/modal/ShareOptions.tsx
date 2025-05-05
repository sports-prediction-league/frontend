import { useState } from 'react';
import { Facebook, Linkedin, Copy, Check } from 'lucide-react';
import { RiTwitterXFill } from "react-icons/ri";
import { FaTelegram } from "react-icons/fa";

interface ShareOptionsProps {
    text: string;
    // url: string;
    isDarkMode?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const ShareOptions = ({
    text,
    // url,
    isDarkMode = true,
    className = "",
    style = {}
}: ShareOptionsProps) => {
    const [copied, setCopied] = useState(false);

    // Colors configuration based on mode
    const colors = {
        background: isDarkMode ? '#05231F' : '#F9F9F9', // Dark: spl-green-400, Light: light gray
        border: isDarkMode ? '#2D947A' : '#E6E6E6',
        text: isDarkMode ? '#FFFFFF' : '#042822',
        iconBg: {
            twitter: '#000000',
            facebook: '#4267B2',
            linkedin: '#0077B5',
            telegram: '#0088cc',
            copy: isDarkMode ? '#2D947A' : '#00644C'
        }
    };

    // Share functions
    const shareToTwitter = () => {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    };

    const shareToFacebook = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    };

    const shareToLinkedin = () => {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    };

    const shareToTelegram = () => {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
        window.open(shareUrl, '_blank');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`${text}`).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div
            className={`rounded-lg shadow-lg p-4 ${className}`}
            style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: '1px',
                ...style
            }}
        >
            <div className="flex justify-between items-center mb-2">
                <p style={{ color: colors.text, fontSize: '0.9rem' }}>Share your achievement</p>
                {/* <div
                    className="absolute w-4 h-4 rotate-45 left-1/2 -translate-x-1/2 -top-2"
                    style={{ backgroundColor: colors.background }}
                ></div> */}
            </div>

            <div className="flex justify-around mb-1">
                <button
                    onClick={shareToTwitter}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: colors.iconBg.twitter }}
                >
                    <RiTwitterXFill size={18} color="#FFFFFF" />
                </button>

                <button
                    onClick={shareToFacebook}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: colors.iconBg.facebook }}
                >
                    <Facebook size={18} color="#FFFFFF" />
                </button>

                <button
                    onClick={shareToLinkedin}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: colors.iconBg.linkedin }}
                >
                    <Linkedin size={18} color="#FFFFFF" />
                </button>

                <button
                    onClick={shareToTelegram}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: colors.iconBg.telegram }}
                >
                    <FaTelegram size={18} color="#FFFFFF" />
                </button>

                <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: colors.iconBg.copy }}
                >
                    {copied ? <Check size={18} color="#FFFFFF" /> : <Copy size={18} color="#FFFFFF" />}
                </button>
            </div>
        </div>
    );
};

export default ShareOptions;