
import React from 'react';
import { userData } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="flex justify-between items-center mb-8 p-2">
      <div className="flex flex-col">
        <div className="flex items-center">
          <Sun className="h-5 w-5 mr-2 text-finance-accent" />
          <h2 className="text-lg font-medium text-finance-accent animate-fade-in">
            {greeting()},
          </h2>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-finance-text animate-fade-in delay-100">
          {userData.name}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full bg-white shadow-md hover:bg-finance-light transition-colors">
          <Bell className="h-5 w-5 text-finance-accent" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-finance-primary rounded-full animate-pulse"></span>
        </button>
        
        <Avatar className="h-12 w-12 border-2 border-finance-primary shadow-md">
          <AvatarImage src={userData.photo} alt={userData.name} className="object-cover" />
          <AvatarFallback className="bg-finance-secondary text-finance-text">
            {userData.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
