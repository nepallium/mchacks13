"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const TokenContext = createContext<{
  token: string | null;
  setToken: (t: string | null) => void;
} | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
}

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error("useToken must be used within TokenProvider");
  return context;
};