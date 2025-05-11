
import React from 'react';
import { userData } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Sun, Moon, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center p-4 bg-white rounded-3xl shadow-sm mb-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            {new Date().getHours() < 18 ? (
              <Sun className="h-5 w-5 mr-2 text-finance-accent" />
            ) : (
              <Moon className="h-5 w-5 mr-2 text-finance-accent" />
            )}
            <h2 className="text-lg font-medium text-finance-accent animate-fade-in">
              {greeting()},
            </h2>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-finance-text"
          >
            {userData.name}
          </motion.h1>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{currentDate}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full bg-white shadow-md hover:bg-finance-light transition-colors"
          >
            <Bell className="h-5 w-5 text-finance-accent" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-finance-primary rounded-full animate-pulse"></span>
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Avatar className="h-12 w-12 border-2 border-finance-primary shadow-md">
              <AvatarImage src={userData.photo} alt={userData.name} className="object-cover" />
              <AvatarFallback className="bg-finance-secondary text-finance-text">
                {userData.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
