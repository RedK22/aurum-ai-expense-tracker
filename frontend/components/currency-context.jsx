"use client";

import {createContext, useContext, useEffect, useState} from "react";

const CurrencyContext = createContext();

const DEFAULT = {code: "INR", symbol: "₹"};

export function CurrencyProvider({children}) {
  const [currency, setCurrencyState] = useState(DEFAULT);

  useEffect(() => {
    const stored = localStorage.getItem("currency");
    if (stored) {
      try {
        setCurrencyState(JSON.parse(stored));
      } catch {}
    }
  }, []);

  function setCurrency(currency) {
    localStorage.setItem("currency", JSON.stringify(currency));
    setCurrencyState(currency);
  }

  return (
    <CurrencyContext.Provider value={{currency, setCurrency}}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
