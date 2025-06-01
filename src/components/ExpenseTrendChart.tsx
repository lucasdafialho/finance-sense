import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dailyExpenses as mockDailyExpenses } from '@/data/mockData';
import { LineChart as LineChartIcon } from 'lucide-react';

interface DailyExpense {
  day: string;
  date: string;
  amount: number;
}

export const ExpenseTrendChart: React.FC = () => {
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>([]);
  const [viewType, setViewType] = useState<'daily' | 'weekly'>('daily');

  const loadDailyExpenses = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem('financeSenseTransactions') || '[]');
      
      if (transactions.length > 0) {
        // Criar dados dos últimos 7 dias baseado nas transações reais
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });
          const dayNumber = date.getDate().toString().padStart(2, '0');
          const dateString = date.toLocaleDateString('pt-BR');
          
          // Calcular gastos do dia
          const dayExpenses = transactions
            .filter((t: any) => {
              if (t.type !== 'expense') return false;
              const transactionDate = new Date(t.timestamp || t.date).toLocaleDateString('pt-BR');
              return transactionDate === dateString;
            })
            .reduce((sum: number, t: any) => sum + t.amount, 0);
          
          last7Days.push({
            day: dayName.charAt(0).toUpperCase() + dayName.slice(1, 3),
            date: dayNumber,
            amount: dayExpenses
          });
        }
        
        setDailyExpenses(last7Days);
      } else {
        // Usar dados mock se não houver transações
        setDailyExpenses(mockDailyExpenses);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de tendência:', error);
      setDailyExpenses(mockDailyExpenses);
    }
  };

  useEffect(() => {
    loadDailyExpenses();

    // Escutar mudanças nas transações
    const handleTransactionAdded = () => {
      loadDailyExpenses();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const totalAmount = dailyExpenses.reduce((sum, day) => sum + day.amount, 0);
  const hasData = totalAmount > 0;

  if (!hasData) {
    return (
      <Card className="rounded-3xl shadow-md border-none bg-white hover:shadow-lg transition-shadow duration-300 dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <LineChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
              Evolução dos Gastos
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Ainda sem dados de tendência</p>
              <p className="text-sm">Registre algumas despesas para ver a evolução!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl shadow-md border-none bg-white hover:shadow-lg transition-shadow duration-300 dark:bg-card dark:text-card-foreground">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <LineChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
            Evolução dos Gastos
          </CardTitle>
          <select 
            value={viewType}
            onChange={(e) => setViewType(e.target.value as 'daily' | 'weekly')}
            className="text-sm bg-finance-light text-finance-text px-3 py-1 rounded-full border-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-finance-primary dark:bg-muted dark:text-muted-foreground dark:focus:ring-primary"
          >
            <option value="daily">Últimos 7 dias</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyExpenses}
              margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#77C9A4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#77C9A4" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value > 0 ? `R$${value}` : 'R$0'}
                width={50}
              />
              <Tooltip 
                formatter={(value: number) => [
                  value > 0 ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00', 
                  'Gastos'
                ]}
                labelFormatter={(label) => {
                  const dayData = dailyExpenses.find(item => item.day === label);
                  return `${label}, ${dayData?.date || ''} ${new Date().toLocaleDateString('pt-BR', { month: 'short' })}`;
                }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)',
                  padding: '10px'
                }}
              />
              <Line
                type="monotone" 
                dataKey="amount" 
                stroke="#77C9A4" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#77C9A4', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#A1EBD0', stroke: '#77C9A4', strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
