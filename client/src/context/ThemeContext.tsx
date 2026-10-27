import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme =
  | "terminal"
  | "editorial"
  | "pixel"
  | "neuform"
  | "modern"
  | "dark"
  | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "editorial",
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("app_theme") as Theme;
    if (saved === "terminal" || saved === "dark" || saved === "pixel") return "terminal";
    return "editorial";
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

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
