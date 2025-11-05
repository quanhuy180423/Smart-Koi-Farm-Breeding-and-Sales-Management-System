"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface FishSchoolContextType {
  isEnabled: boolean;
  toggleFishSchool: () => void;
}

const FishSchoolContext = createContext<FishSchoolContextType | undefined>(
  undefined,
);

export const FishSchoolProvider = ({ children }: { children: ReactNode }) => {
  const [isEnabled, setIsEnabled] = useState(true);

  // Load preference from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("fishSchoolEnabled");
    if (saved !== null) {
      setIsEnabled(saved === "true");
    } else {
      // Default to true if not set
      localStorage.setItem("fishSchoolEnabled", "true");
    }
  }, []);

  const toggleFishSchool = () => {
    setIsEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("fishSchoolEnabled", String(newValue));
      return newValue;
    });
  };

  return (
    <FishSchoolContext.Provider value={{ isEnabled, toggleFishSchool }}>
      {children}
    </FishSchoolContext.Provider>
  );
};

export const useFishSchool = () => {
  const context = useContext(FishSchoolContext);
  if (!context) {
    throw new Error("useFishSchool must be used within FishSchoolProvider");
  }
  return context;
};
