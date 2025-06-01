import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUp, CircleDollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; 

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currentSavings: number;
  savingsGoal: number;
  month: string;
}

export const FinancialSummaryCard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    currentSavings: 0,
    savingsGoal: 10000,
    month: new Date().toLocaleDateString('pt-BR', { month: 'long' })
  });

  const loadFinancialData = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem('financeSenseTransactions') || '[]');
      
      // Calcular totais das transações reais
      const totalIncome = transactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const balance = totalIncome - totalExpenses;
      
      // Simular poupança baseada no saldo (valor inicial + saldo positivo)
      const baseSavings = 8500; // Valor inicial como nos mock data
      const currentSavings = Math.max(0, baseSavings + (balance > 0 ? balance * 0.3 : 0));
      
      setFinancialData({
        totalIncome,
        totalExpenses,
        balance,
        currentSavings,
        savingsGoal: 10000,
        month: new Date().toLocaleDateString('pt-BR', { month: 'long' })
      });
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    }
  };

  useEffect(() => {
    loadFinancialData();

    // Escutar mudanças nas transações
    const handleTransactionAdded = () => {
      loadFinancialData();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const savingsPercentage = Math.min(100, Math.round((financialData.currentSavings / financialData.savingsGoal) * 100));

  return (
    <Card className="overflow-hidden mb-8 rounded-3xl shadow-lg border-none hover-lift">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-6 text-white dark:from-finance-primary/90 dark:to-finance-accent/90">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">Resumo de {financialData.month}</h3>
            <CircleDollarSign className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-sm opacity-80 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Baseado nas suas transações reais</span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-3 gap-4 bg-white dark:bg-card dark:text-card-foreground">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Entradas</span>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 text-finance-success mr-1" />
              <span className="text-lg font-bold text-finance-success">
                R$ {financialData.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center border-x border-muted px-2">
            <span className="text-sm text-muted-foreground mb-1">Saídas</span>
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 text-finance-danger mr-1" />
              <span className="text-lg font-bold text-finance-danger">
                R$ {financialData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Saldo</span>
            <span className={`text-lg font-bold ${financialData.balance >= 0 ? 'text-finance-success' : 'text-finance-danger'}`}>
              R$ {financialData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="px-6 pb-6 bg-white dark:bg-card dark:text-card-foreground">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-finance-accent font-medium">Meta de poupança</span>
            <span className="font-semibold">{savingsPercentage}%</span>
          </div>
          <Progress 
            value={savingsPercentage} 
            className="h-2 bg-finance-light dark:bg-muted [&>div]:bg-finance-primary dark:[&>div]:bg-primary" 
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>R$ {financialData.currentSavings.toLocaleString('pt-BR')}</span>
            <span>Meta: R$ {financialData.savingsGoal.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
