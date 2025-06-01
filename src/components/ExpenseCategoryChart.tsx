import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { expenseCategories as mockCategories } from '@/data/mockData';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

export const ExpenseCategoryChart: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  const loadCategories = () => {
    try {
      const localCategories = JSON.parse(localStorage.getItem('financeSenseCategories') || '[]');
      
      if (localCategories.length > 0) {
        // Usar categorias reais do localStorage
        setCategories(localCategories);
      } else {
        // Usar dados mock se não houver dados reais
        setCategories(mockCategories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories(mockCategories);
    }
  };

  useEffect(() => {
    loadCategories();

    // Escutar mudanças nas transações
    const handleTransactionAdded = () => {
      loadCategories();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  
  // Formatar para o gráfico
  const data = categories.map(item => ({
    name: item.category,
    value: item.amount,
    color: item.color
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Não mostrar label para fatias muito pequenas
    
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

  if (total === 0) {
    return (
      <Card className="rounded-3xl shadow-md border-none bg-white hover:shadow-lg transition-shadow duration-300 dark:bg-card dark:text-card-foreground">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
              Gastos por Categoria
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Nenhum gasto registrado</p>
              <p className="text-sm">Comece registrando suas despesas acima!</p>
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
            <PieChartIcon className="h-5 w-5 mr-2 text-finance-primary" />
            Gastos por Categoria
          </CardTitle>
          <span className="text-sm text-muted-foreground bg-finance-light rounded-full px-3 py-1 dark:bg-muted">
            R$ {total.toLocaleString('pt-BR')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationEasing="ease-in-out"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={(value, entry, index) => {
                  return (
                    <span className="text-sm text-muted-foreground">
                      {value} - R$ {categories[index].amount.toLocaleString('pt-BR')}
                    </span>
                  );
                }}
                iconType="circle"
                iconSize={10}
              />
              <Tooltip 
                formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                separator=": "
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  color: 'var(--card-foreground)',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid var(--border)',
                  padding: '10px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
