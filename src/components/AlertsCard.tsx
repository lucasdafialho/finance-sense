
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { alertsData } from '@/data/mockData';

export const AlertsCard: React.FC = () => {
  return (
    <Card className="overflow-hidden mb-6 rounded-3xl shadow-md border-none hover-lift">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-warning to-finance-warning/70 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-finance-text mr-2" />
              <h3 className="font-semibold text-finance-text">Alertas Inteligentes</h3>
            </div>
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-medium">
              {alertsData.length} novos
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-muted/30">
          {alertsData.map((alert, index) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 flex items-center justify-between bg-white hover:bg-finance-light/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start">
                <span className={`shrink-0 p-2 rounded-full mr-3 ${
                  alert.severity === 'high' 
                    ? 'bg-finance-danger/20 text-finance-danger' 
                    : 'bg-finance-warning/20 text-finance-text'
                }`}>
                  {alert.severity === 'high' ? 
                    <AlertCircle className="h-4 w-4" /> : 
                    <TrendingUp className="h-4 w-4" />
                  }
                </span>
                <div>
                  <p className="text-sm font-medium text-finance-text">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
