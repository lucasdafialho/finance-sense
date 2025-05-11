
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dailyExpenses } from '@/data/mockData';
import { LineChart as LineChartIcon } from 'lucide-react';

export const ExpenseTrendChart: React.FC = () => {
  return (
    <Card className="finance-card mb-6 hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <LineChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
            Evolução dos Gastos
          </CardTitle>
          <select 
            className="text-sm border rounded-lg px-2 py-1 bg-finance-light text-finance-text focus:outline-none focus:ring-1 focus:ring-finance-primary"
          >
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dailyExpenses}
              margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `R$${value}`}
                width={50}
              />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                labelFormatter={(label) => `${label}, ${dailyExpenses.find(item => item.day === label)?.date} Maio`}
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  border: 'none'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#77C9A4" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#77C9A4', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#A1EBD0', stroke: '#77C9A4', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
