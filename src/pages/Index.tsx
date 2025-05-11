
import React from 'react';
import { Header } from '@/components/Header';
import { FinancialSummaryCard } from '@/components/FinancialSummaryCard';
import { ExpenseCategoryChart } from '@/components/ExpenseCategoryChart';
import { ExpenseTrendChart } from '@/components/ExpenseTrendChart';
import { ExpenseInput } from '@/components/ExpenseInput';
import { SuggestionsButton } from '@/components/SuggestionsButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white px-4 py-6 sm:px-6 md:py-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <Header />
        
        {/* Cartão de resumo financeiro */}
        <FinancialSummaryCard />
        
        {/* Entrada para registro de despesas */}
        <ExpenseInput />
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ExpenseCategoryChart />
          <ExpenseTrendChart />
        </div>
        
        {/* Botão flutuante de sugestões */}
        <SuggestionsButton />
      </div>
    </div>
  );
};

export default Index;
