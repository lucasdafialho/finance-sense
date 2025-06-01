import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { List, ArrowDownRight, ArrowUpRight, Coffee, ShoppingCart, Home, Utensils, Car, Briefcase, Plus, X } from 'lucide-react';
import { transactions as mockTransactions } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mapeamento de categorias para ícones
const categoryIcons: Record<string, React.ReactNode> = {
  'Alimentação': <Utensils className="h-4 w-4" />,
  'Compras': <ShoppingCart className="h-4 w-4" />,
  'Moradia': <Home className="h-4 w-4" />,
  'Transporte': <Car className="h-4 w-4" />,
  'Entretenimento': <Coffee className="h-4 w-4" />,
  'Saúde': <Plus className="h-4 w-4" />,
  'Renda': <Briefcase className="h-4 w-4" />,
  'Transferência': <Briefcase className="h-4 w-4" />,
  'Outros': <ShoppingCart className="h-4 w-4" />,
};

export const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAllModal, setShowAllModal] = useState(false);

  const loadTransactions = () => {
    const localTransactions = JSON.parse(localStorage.getItem('financeSenseTransactions') || '[]');
    
    if (localTransactions.length > 0) {
      const sortedTransactions = localTransactions.sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp || a.date).getTime();
        const dateB = new Date(b.timestamp || b.date).getTime();
        return !isNaN(dateB) && !isNaN(dateA) ? dateB - dateA : 0;
      });
      setTransactions(sortedTransactions);
    } else {
      setTransactions(mockTransactions);
    }
  };

  useEffect(() => {
    loadTransactions();

    const handleTransactionAdded = () => {
      loadTransactions();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Data inválida';
      
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  const TransactionItem = ({ transaction, showDate = false }: { transaction: any; showDate?: boolean }) => (
    <div 
      key={transaction.id}
      className="p-4 flex items-center justify-between hover:bg-finance-light/30 transition-colors dark:hover:bg-muted/30"
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
          <p className="text-xs text-muted-foreground">
            {transaction.category} • {formatDate(transaction.timestamp || transaction.date)}
            {showDate && transaction.timestamp && (
              <span className="ml-2">
                {new Date(transaction.timestamp).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </p>
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
  );

  return (
    <>
      <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6 dark:bg-card dark:text-card-foreground">
        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <List className="h-5 w-5 mr-2 text-finance-accent" />
              <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
            </div>
            <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-finance-accent hover:text-finance-primary hover:bg-finance-light dark:hover:bg-muted dark:hover:text-primary"
                  disabled={transactions.length === 0}
                >
                  Ver todas
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl border-none shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl">Todas as Transações</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[60vh] rounded-xl">
                  {transactions.length > 0 ? (
                    <div className="divide-y divide-muted/30">
                      {transactions.map((transaction) => (
                        <TransactionItem 
                          key={transaction.id} 
                          transaction={transaction} 
                          showDate={true} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <List className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Nenhuma transação encontrada</p>
                      <p className="text-sm">Comece registrando suas primeiras transações!</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Total: {transactions.length} transações
                  </p>
                  <Button 
                    onClick={() => setShowAllModal(false)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Fechar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length > 0 ? (
            <div className="divide-y divide-muted/30">
              {transactions.slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <List className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nenhuma transação registrada</p>
              <p className="text-sm">Suas transações aparecerão aqui conforme você as registra!</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-muted/10 dark:bg-muted/20">
          <p className="text-xs text-muted-foreground text-center w-full">
            {transactions.length > 5 
              ? `Últimas 5 de ${transactions.length} transações exibidas. Clique em "Ver todas" para o histórico completo.`
              : transactions.length > 0 
                ? `${transactions.length} transação${transactions.length === 1 ? '' : 'ões'} exibida${transactions.length === 1 ? '' : 's'}.`
                : 'Comece registrando suas transações usando o campo acima!'
            }
          </p>
        </CardFooter>
      </Card>
    </>
  );
};
