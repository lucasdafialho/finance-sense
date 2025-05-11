
import React from 'react';
import { financialSummary } from '@/data/mockData';
import { ArrowDown, ArrowUp, CircleDollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; 

export const FinancialSummaryCard: React.FC = () => {
  const savingsPercentage = Math.round((financialSummary.currentSavings / financialSummary.savingsGoal) * 100);

  return (
    <Card className="overflow-hidden mb-8 rounded-3xl shadow-lg border-none hover-lift">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">Resumo de {financialSummary.month}</h3>
            <CircleDollarSign className="h-6 w-6 opacity-80" />
          </div>
          <div className="text-sm opacity-80 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Visão geral das suas finanças</span>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-3 gap-4 bg-white">
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Entradas</span>
            <div className="flex items-center">
              <ArrowUp className="h-4 w-4 text-finance-success mr-1" />
              <span className="text-lg font-bold text-finance-success">
                R$ {financialSummary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center border-x border-muted px-2">
            <span className="text-sm text-muted-foreground mb-1">Saídas</span>
            <div className="flex items-center">
              <ArrowDown className="h-4 w-4 text-finance-danger mr-1" />
              <span className="text-lg font-bold text-finance-danger">
                R$ {financialSummary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Saldo</span>
            <span className="text-lg font-bold text-finance-text">
              R$ {financialSummary.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="px-6 pb-6 bg-white">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-finance-accent font-medium">Meta de economia</span>
            <span className="font-semibold">{savingsPercentage}%</span>
          </div>
          <Progress 
            value={savingsPercentage} 
            className="h-2 bg-finance-light" 
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>R$ {financialSummary.currentSavings.toLocaleString('pt-BR')}</span>
            <span>Meta: R$ {financialSummary.savingsGoal.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
