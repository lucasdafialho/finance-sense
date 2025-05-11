
import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FeedbackType = 'achievement' | 'progress' | 'congratulation';

interface FeedbackMessageProps {
  type: FeedbackType;
  message: string;
  autoHide?: boolean;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ 
  type, 
  message, 
  autoHide = true 
}) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide]);
  
  const getIcon = () => {
    switch (type) {
      case 'achievement':
        return <Star className="h-5 w-5 text-finance-warning" />;
      case 'progress':
        return <TrendingUp className="h-5 w-5 text-finance-success" />;
      case 'congratulation':
        return <Award className="h-5 w-5 text-finance-purple" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'achievement':
        return 'bg-finance-warning/10 border-finance-warning/30';
      case 'progress':
        return 'bg-finance-success/10 border-finance-success/30';
      case 'congratulation':
        return 'bg-finance-purple/10 border-finance-purple/30';
    }
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`rounded-2xl p-4 mb-4 border ${getBgColor()} flex items-center`}
        >
          <div className="mr-3">
            {getIcon()}
          </div>
          <p className="text-sm font-medium text-finance-text flex-1">{message}</p>
          {autoHide && (
            <button 
              onClick={() => setVisible(false)}
              className="text-muted-foreground hover:text-finance-text ml-2"
            >
              &times;
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
