import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'src/context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme();
    };

    return (
        <button
            onClick={handleClick}
            className={`
        relative h-12 w-12 rounded-full
        flex items-center justify-center
        transition-colors duration-500
        ${isDark ? 'bg-[#042822]' : 'bg-amber-100'}
        hover:scale-110 transform transition-all
        shadow-lg dark:shadow-[rgba(255,255,255,.3)] dark:shadow
      `}
            aria-label="Toggle dark mode"
        >
            <Sun
                className={`
          absolute h-6 w-6 text-amber-500
          transition-all duration-500
          ${isDark
                        ? 'opacity-0 rotate-[-180deg] scale-50'
                        : 'opacity-100 rotate-0 scale-100'
                    }
        `}
            />
            <Moon
                className={`
          absolute h-6 w-6 text-slate-200
          transition-all duration-500
          ${isDark
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-[180deg] scale-50'
                    }
        `}
            />
        </button>
    );
};

export default ThemeToggle;