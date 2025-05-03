import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    const handleClick = () => {
        // const rect = e.currentTarget.getBoundingClientRect();
        toggleTheme();
    };

    return (
        <button
            onClick={handleClick}
            className={`
        relative h-12 w-12 rounded-full
        flex items-center justify-center
        transition-colors duration-500
       bg-transparent
        hover:scale-110 transform transition-all
        
      `}
            aria-label="Toggle dark mode"
        >
            <Sun
                className={`
          absolute h-5 w-5 text-amber-500
          transition-all duration-500
          ${isDark
                        ? 'opacity-0 rotate-[-180deg] scale-50'
                        : 'opacity-100 rotate-0 scale-100'
                    }
        `}
            />
            <Moon
                className={`
          absolute h-5 w-5 text-slate-200
          transition-all duration-500
          ${isDark
                        ? 'opacity-80 rotate-0 scale-100'
                        : 'opacity-0 rotate-[180deg] scale-50'
                    }
        `}
            />
        </button>
    );
};

export default ThemeToggle;