
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { economyTips } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export const EconomyTips: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % economyTips.length);
  };
  
  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + economyTips.length) % economyTips.length);
  };
  
  const currentTip = economyTips[currentTipIndex];
  
  return (
    <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6 dark:bg-card dark:text-card-foreground">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center mb-2">
          <Lightbulb className="h-5 w-5 mr-2 text-finance-warning" />
          <CardTitle className="text-lg font-semibold dark:text-card-foreground">Dicas de Economia</CardTitle>
        </div>
        <CardDescription className="dark:text-muted-foreground">
          Pequenas mudanças que podem fazer grande diferença
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="min-h-[200px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTipIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-finance-light/50 p-5 rounded-2xl mb-4 dark:bg-muted/30"
            >
              <h4 className="font-medium text-finance-accent mb-2 dark:text-primary">{currentTip.title}</h4>
              <p className="text-sm text-finance-text mb-3 dark:text-card-foreground">{currentTip.description}</p>
              <div className="text-xs text-finance-success font-medium">
                Economia potencial: {currentTip.potentialSavings}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {economyTips.map((_, index) => (
                <span 
                  key={index} 
                  className={`block h-1.5 w-6 rounded-full ${index === currentTipIndex ? 'bg-finance-primary dark:bg-primary' : 'bg-muted'}`}
                />
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-full dark:border-muted-foreground dark:text-muted-foreground dark:hover:bg-muted/50"
                onClick={prevTip}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8 rounded-full dark:border-muted-foreground dark:text-muted-foreground dark:hover:bg-muted/50"
                onClick={nextTip}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
