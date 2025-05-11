
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="rounded-full border-transparent hover:border-primary/30 hover:bg-muted"
        title={theme === 'light' ? 'Modo noturno' : 'Modo claro'}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-finance-accent" />
        ) : (
          <Sun className="h-5 w-5 text-finance-warning" />
        )}
        <span className="sr-only">{theme === 'light' ? 'Modo noturno' : 'Modo claro'}</span>
      </Button>
    </motion.div>
  );
};
