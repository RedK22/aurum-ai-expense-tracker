"use client";

import {createContext, useContext, useEffect, useState} from "react";

const ThemeContext = createContext();

export function ThemeProviderCustom({children}) {
  const [theme, setTheme] = useState("emeraldStack");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "emeraldStack";
    setTheme(saved);
  }, []);

  function changeTheme(value) {
    localStorage.setItem("theme", value);
    setTheme(value);
  }

  return (
    <ThemeContext.Provider value={{theme, changeTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
