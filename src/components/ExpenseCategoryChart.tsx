
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { expenseCategories } from '@/data/mockData';
import { PieChart as PieChartIcon } from 'lucide-react';

export const ExpenseCategoryChart: React.FC = () => {
  const total = expenseCategories.reduce((sum, category) => sum + category.amount, 0);
  
  // Formatar para o gráfico
  const data = expenseCategories.map(item => ({
    name: item.category,
    value: item.amount,
    color: item.color
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="finance-card mb-6 hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
            Gastos por Categoria
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Total: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={(value, entry, index) => {
                  return (
                    <span className="text-sm text-finance-text">
                      {value} - R$ {expenseCategories[index].amount.toLocaleString('pt-BR')}
                    </span>
                  );
                }}
              />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                separator=": "
                labelClassName="text-xs"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
