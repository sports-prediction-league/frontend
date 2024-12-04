import React, { createContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  mode: string;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.theme === "dark" || 
           (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ mode: isDarkMode ? 'dark' : 'light', toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 