import React, { createContext, useState, useContext } from 'react';
import { lightColors, darkColors } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};