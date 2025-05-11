
import React from 'react';
import { userData } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-finance-accent">
          {greeting()},
        </h2>
        <h1 className="text-2xl font-bold text-finance-text">
          {userData.name}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full bg-finance-light hover:bg-finance-secondary transition-colors">
          <Bell className="h-5 w-5 text-finance-accent" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-finance-primary rounded-full"></span>
        </button>
        
        <Avatar className="h-10 w-10 border-2 border-finance-primary">
          <AvatarImage src={userData.photo} alt={userData.name} />
          <AvatarFallback className="bg-finance-secondary text-finance-text">
            {userData.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
