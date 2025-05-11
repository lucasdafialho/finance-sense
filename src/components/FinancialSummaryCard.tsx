
import React from 'react';
import { financialSummary } from '@/data/mockData';
import { ArrowDown, ArrowUp, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const FinancialSummaryCard: React.FC = () => {
  return (
    <Card className="finance-card mb-6 hover-lift overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-finance-primary to-finance-secondary p-5 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Resumo de {financialSummary.month}</h3>
            <CircleDollarSign className="h-6 w-6" />
          </div>
        </div>
        
        <div className="p-5 grid grid-cols-3 gap-4">
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
        
        <div className="px-5 pb-4">
          <div className="w-full bg-finance-light rounded-full h-2">
            <div 
              className="bg-finance-primary h-2 rounded-full animate-pulse-light"
              style={{ 
                width: `${(financialSummary.currentSavings / financialSummary.savingsGoal) * 100}%` 
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Meta de economia: {Math.round((financialSummary.currentSavings / financialSummary.savingsGoal) * 100)}%</span>
            <span>R$ {financialSummary.currentSavings.toLocaleString('pt-BR')} / R$ {financialSummary.savingsGoal.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
