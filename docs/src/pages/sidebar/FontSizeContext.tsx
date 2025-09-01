import React, { createContext, useState, useContext } from "react";

/* Font size type definition */
type FontSizeType = "13px" | "18px" | "24px";

/* Create context for font size management */
const FontSizeContext = createContext<{
  fontSize: FontSizeType;
  setFontSize: React.Dispatch<React.SetStateAction<FontSizeType>>;
} | undefined>(undefined);

/* FontSizeProvider component for wrapping app with font size context */
export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<FontSizeType>("18px");

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

/* Custom hook to access font size and setter function */
export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};