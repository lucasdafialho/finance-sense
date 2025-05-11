
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, ArrowDownRight, ArrowUpRight, Coffee, ShoppingCart, Home, Utensils, Car } from 'lucide-react';
import { transactions } from '@/data/mockData';

// Mapeamento de categorias para ícones
const categoryIcons: Record<string, React.ReactNode> = {
  'Alimentação': <Utensils className="h-4 w-4" />,
  'Compras': <ShoppingCart className="h-4 w-4" />,
  'Moradia': <Home className="h-4 w-4" />,
  'Transporte': <Car className="h-4 w-4" />,
  'Lazer': <Coffee className="h-4 w-4" />,
};

export const RecentTransactions: React.FC = () => {
  return (
    <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6">
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <List className="h-5 w-5 mr-2 text-finance-accent" />
            <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-finance-accent hover:text-finance-primary hover:bg-finance-light">
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-muted/30">
          {transactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id}
              className="p-4 flex items-center justify-between hover:bg-finance-light/30 transition-colors"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  transaction.type === 'expense' 
                    ? 'bg-finance-danger/10 text-finance-danger' 
                    : 'bg-finance-success/10 text-finance-success'
                }`}>
                  {transaction.type === 'expense' ? 
                    (categoryIcons[transaction.category] || <ArrowDownRight className="h-4 w-4" />) : 
                    <ArrowUpRight className="h-4 w-4" />
                  }
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                </div>
              </div>
              <span className={`font-medium ${
                transaction.type === 'expense' 
                  ? 'text-finance-danger' 
                  : 'text-finance-success'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'} 
                R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/10">
        <p className="text-xs text-muted-foreground text-center w-full">
          Últimas 5 transações exibidas. Clique em "Ver todas" para o histórico completo.
        </p>
      </CardFooter>
    </Card>
  );
};
