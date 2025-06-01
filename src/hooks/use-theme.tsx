
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use state with null initial value for SSR compatibility
  const [theme, setTheme] = useState<Theme | null>(null);
  
  useEffect(() => {
    // Run this only on client side
    const savedTheme = localStorage.getItem('finance-theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    // Only apply theme changes when theme is actually set
    if (theme) {
      const root = window.document.documentElement;
      
      // Remove all theme classes first to ensure clean state
      root.classList.remove('light', 'dark');
      
      // Force reflow to ensure classes are removed
      void root.offsetHeight;
      
      // Apply theme class to root element
      root.classList.add(theme);
      
      // Save user preference
      localStorage.setItem('finance-theme', theme);
    }
  }, [theme]);

  // Only render children when theme is determined to avoid flash
  return (
    <ThemeContext.Provider value={{ 
      theme: theme || 'light', 
      setTheme: (newTheme) => setTheme(newTheme)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
