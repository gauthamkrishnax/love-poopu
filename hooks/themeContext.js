import { createContext, useContext } from 'react'; 
import Theme from '../constants/Theme'

const ThemeContext = createContext(Theme);

export const useTheme = (themeName = "default") => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context[themeName];
};

export const ThemeProvider = ({ children }) => {
    return <ThemeContext.Provider value={Theme}>{children}</ThemeContext.Provider>;
  };