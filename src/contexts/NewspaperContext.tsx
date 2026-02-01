import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { NewspaperId, newspapers, NewspaperConfig } from "@/data/newspapers";

interface NewspaperContextType {
  currentPaper: NewspaperConfig;
  setCurrentPaper: (id: NewspaperId) => void;
}

const NewspaperContext = createContext<NewspaperContextType | undefined>(undefined);

export function NewspaperProvider({ children }: { children: ReactNode }) {
  const [paperId, setPaperId] = useState<NewspaperId>("amar-ujala");

  const setCurrentPaper = useCallback((id: NewspaperId) => {
    setPaperId(id);
    // Update CSS variables for dynamic theming
    const root = document.documentElement;
    const paper = newspapers[id];
    root.style.setProperty("--primary", paper.primaryColor);
    root.style.setProperty("--accent", paper.accentColor);
    root.style.setProperty("--ring", paper.primaryColor);
    root.style.setProperty("--sidebar-primary", paper.primaryColor);
  }, []);

  return (
    <NewspaperContext.Provider value={{ currentPaper: newspapers[paperId], setCurrentPaper }}>
      {children}
    </NewspaperContext.Provider>
  );
}

export function useNewspaper() {
  const ctx = useContext(NewspaperContext);
  if (!ctx) throw new Error("useNewspaper must be used within NewspaperProvider");
  return ctx;
}
