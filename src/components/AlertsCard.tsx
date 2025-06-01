import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingUp, AlertTriangle, ChevronRight, Bell, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { alertsData as mockAlerts } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  type: 'expense' | 'goal' | 'trend' | 'suggestion';
}

export const AlertsCard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  const generateAlerts = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem('financeSenseTransactions') || '[]');
      const categories = JSON.parse(localStorage.getItem('financeSenseCategories') || '[]');
      const goals = JSON.parse(localStorage.getItem('financeSenseGoals') || '[]');
      
      const newAlerts: Alert[] = [];
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      
      // Se não há dados suficientes, usar alerts mock
      if (transactions.length === 0) {
        setAlerts(mockAlerts);
        return;
      }

      // Alerta 1: Gastos altos em categorias específicas
      if (categories.length > 0) {
        const totalExpenses = categories.reduce((sum: number, cat: any) => sum + cat.amount, 0);
        const highSpendingCategories = categories.filter((cat: any) => (cat.amount / totalExpenses) > 0.35);
        
        highSpendingCategories.forEach((cat: any) => {
          const percentage = ((cat.amount / totalExpenses) * 100).toFixed(0);
          newAlerts.push({
            id: `high-spending-${cat.category}`,
            message: `Você gastou ${percentage}% do total na categoria ${cat.category} (R$ ${cat.amount.toLocaleString('pt-BR')})`,
            severity: 'high',
            date: today.toLocaleDateString('pt-BR'),
            type: 'expense'
          });
        });
      }

      // Alerta 2: Metas próximas do prazo
      goals.forEach((goal: any) => {
        const targetDate = new Date(goal.targetDate.split('/').reverse().join('-'));
        const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        
        if (daysToTarget <= 30 && progress < 50) {
          newAlerts.push({
            id: `goal-behind-${goal.id}`,
            message: `Meta "${goal.title}" está atrasada. Faltam ${daysToTarget} dias e você tem apenas ${progress.toFixed(0)}% completo.`,
            severity: 'medium',
            date: today.toLocaleDateString('pt-BR'),
            type: 'goal'
          });
        }
      });

      // Alerta 3: Gastos acima da média nos últimos dias
      const last7Days = transactions
        .filter((t: any) => {
          const transactionDate = new Date(t.timestamp || t.date);
          const daysDiff = (today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7 && t.type === 'expense';
        })
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      const previousWeek = transactions
        .filter((t: any) => {
          const transactionDate = new Date(t.timestamp || t.date);
          const daysDiff = (today.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff > 7 && daysDiff <= 14 && t.type === 'expense';
        })
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      if (last7Days > previousWeek && previousWeek > 0) {
        const increase = ((last7Days - previousWeek) / previousWeek * 100).toFixed(0);
        newAlerts.push({
          id: 'weekly-increase',
          message: `Seus gastos aumentaram ${increase}% esta semana em relação à anterior (R$ ${last7Days.toLocaleString('pt-BR')})`,
          severity: 'medium',
          date: today.toLocaleDateString('pt-BR'),
          type: 'trend'
        });
      }

      // Alerta 4: Transações duplicadas ou suspeitas
      const duplicates = transactions.filter((t1: any, index: number) =>
        transactions.findIndex((t2: any) =>
          t2.amount === t1.amount && 
          t2.description.toLowerCase() === t1.description.toLowerCase() &&
          Math.abs(new Date(t2.timestamp || t2.date).getTime() - new Date(t1.timestamp || t1.date).getTime()) < 24 * 60 * 60 * 1000
        ) !== index
      );

      if (duplicates.length > 0) {
        newAlerts.push({
          id: 'duplicate-transactions',
          message: `Detectamos ${duplicates.length} transação(ões) que podem estar duplicadas. Verifique seu histórico.`,
          severity: 'medium',
          date: today.toLocaleDateString('pt-BR'),
          type: 'expense'
        });
      }

      // Alerta 5: Falta de transações de renda
      const hasIncomeThisMonth = transactions.some((t: any) => {
        const transactionDate = new Date(t.timestamp || t.date);
        return t.type === 'income' && 
               transactionDate.getMonth() === thisMonth && 
               transactionDate.getFullYear() === thisYear;
      });

      if (!hasIncomeThisMonth && transactions.length > 0) {
        newAlerts.push({
          id: 'no-income',
          message: 'Você ainda não registrou nenhuma receita este mês. Lembre-se de registrar seu salário!',
          severity: 'medium',
          date: today.toLocaleDateString('pt-BR'),
          type: 'suggestion'
        });
      }

      // Limitar a 3 alertas mais importantes
      const sortedAlerts = newAlerts
        .sort((a, b) => {
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        })
        .slice(0, 3);

      // Se não há alertas gerados, mostrar uma mensagem positiva
      if (sortedAlerts.length === 0) {
        sortedAlerts.push({
          id: 'all-good',
          message: 'Tudo certo com suas finanças! Continue registrando suas transações.',
          severity: 'low',
          date: today.toLocaleDateString('pt-BR'),
          type: 'suggestion'
        });
      }

      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Erro ao gerar alertas:', error);
      setAlerts(mockAlerts);
    }
  };

  useEffect(() => {
    generateAlerts();

    // Escutar mudanças nas transações
    const handleTransactionAdded = () => {
      generateAlerts();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const handleAlertClick = (alert: Alert) => {
    toast({
      title: alert.severity === 'high' ? "⚠️ Alerta importante" : alert.severity === 'medium' ? "📊 Observação" : "✅ Informação",
      description: alert.message,
      duration: 4000,
    });
  };

  const getAlertIcon = (severity: string, type: string) => {
    if (severity === 'high') return <AlertCircle className="h-4 w-4" />;
    if (type === 'trend') return <TrendingUp className="h-4 w-4" />;
    if (type === 'goal') return <AlertTriangle className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  return (
    <Card className="overflow-hidden mb-6 rounded-3xl shadow-md border-none hover-lift dark:bg-card">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-warning to-finance-warning/70 p-4 text-finance-text dark:from-finance-warning/80 dark:to-finance-warning/50 dark:text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Alertas Inteligentes</h3>
            </div>
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-medium dark:bg-white/20">
              {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-muted/30">
          {alerts.map((alert, index) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ backgroundColor: alert.severity === 'high' ? "rgba(229, 115, 115, 0.05)" : "rgba(255, 213, 79, 0.05)" }}
              className="p-4 flex items-center justify-between bg-white hover:bg-finance-light/50 transition-colors cursor-pointer dark:bg-card dark:text-card-foreground dark:hover:bg-white/5"
              onClick={() => handleAlertClick(alert)}
            >
              <div className="flex items-start">
                <span className={`shrink-0 p-2 rounded-full mr-3 ${
                  alert.severity === 'high' 
                    ? 'bg-finance-danger/20 text-finance-danger' 
                    : alert.severity === 'medium'
                    ? 'bg-finance-warning/20 text-finance-text'
                    : 'bg-finance-success/20 text-finance-success'
                }`}>
                  {getAlertIcon(alert.severity, alert.type)}
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
                  className="text-xs text-finance-accent hover:text-finance-primary hover:bg-finance-light/50 w-full dark:text-primary dark:hover:bg-white/5 dark:hover:text-primary/80"
                  onClick={generateAlerts}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Atualizar alertas
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Gerar novos alertas baseados em seus dados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
