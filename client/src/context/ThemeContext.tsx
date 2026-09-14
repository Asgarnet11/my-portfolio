import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "pixel" | "modern" | "terminal";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "pixel",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("app_theme") as Theme) || "pixel";
  });

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("app_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// This hook intentionally shares the context with ThemeProvider from this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
