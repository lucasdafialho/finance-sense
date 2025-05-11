
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingUp, AlertTriangle, ChevronRight, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { alertsData } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const AlertsCard: React.FC = () => {
  const { toast } = useToast();

  const handleAlertClick = (alert: any) => {
    toast({
      title: alert.severity === 'high' ? "Alerta importante" : "Observação",
      description: alert.message,
      duration: 3000,
    });
  };

  return (
    <Card className="overflow-hidden mb-6 rounded-3xl shadow-md border-none hover-lift dark:bg-finance-text/10 dark:border dark:border-white/10">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-warning to-finance-warning/70 p-4 dark:from-finance-warning/80 dark:to-finance-warning/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-finance-text mr-2" />
              <h3 className="font-semibold text-finance-text">Alertas Inteligentes</h3>
            </div>
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-medium dark:bg-white/20">
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
              whileHover={{ backgroundColor: alert.severity === 'high' ? "rgba(229, 115, 115, 0.05)" : "rgba(255, 213, 79, 0.05)" }}
              className="p-4 flex items-center justify-between bg-white hover:bg-finance-light/50 transition-colors cursor-pointer dark:bg-transparent dark:hover:bg-white/5"
              onClick={() => handleAlertClick(alert)}
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
                  <p className="text-sm font-medium text-finance-text dark:text-white">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.date}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
        
        <div className="p-3 bg-muted/10 flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs text-finance-accent hover:text-finance-primary hover:bg-finance-light/50 w-full dark:hover:bg-white/5"
                  onClick={() => {
                    toast({
                      title: "Gerenciamento de Alertas",
                      description: "Configurações de alertas serão implementadas em breve.",
                      duration: 3000,
                    });
                  }}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Configurar alertas
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Personalize seus alertas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
