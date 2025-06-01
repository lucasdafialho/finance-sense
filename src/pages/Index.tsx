import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { FinancialSummaryCard } from '@/components/FinancialSummaryCard';
import { ExpenseCategoryChart } from '@/components/ExpenseCategoryChart';
import { ExpenseTrendChart } from '@/components/ExpenseTrendChart';
import { ExpenseInput } from '@/components/ExpenseInput';
import { SuggestionsButton } from '@/components/SuggestionsButton';
import { AlertsCard } from '@/components/AlertsCard';
import { GoalsCard } from '@/components/GoalsCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { EconomyTips } from '@/components/EconomyTips';
import { ChatAssistant } from '@/components/ChatAssistant';
import { SimulatorCard } from '@/components/SimulatorCard';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [showFeedback, setShowFeedback] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white px-4 py-6 sm:px-6 md:py-8 dark:from-background dark:to-background">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <Header />
        
        {/* Feedback positivo */}
        {showFeedback && (
          <FeedbackMessage 
            type="achievement" 
            message="Você está a 80% da sua meta de economia! Continue assim!" 
            autoHide={true}
          />
        )}
        
        {/* Cartão de resumo financeiro */}
        <FinancialSummaryCard />
        
        {/* Alertas Inteligentes */}
        <AlertsCard />
        
        {/* Entrada para registro de despesas */}
        <ExpenseInput />
        
        {/* Tabs para organizar o conteúdo */}
        <Tabs defaultValue="overview" className="my-6">
          <TabsList className="grid grid-cols-3 mb-6 p-1 rounded-xl bg-white shadow-sm dark:bg-muted">
            <TabsTrigger value="overview" className="rounded-lg text-sm">Visão Geral</TabsTrigger>
            <TabsTrigger value="goals" className="rounded-lg text-sm">Objetivos</TabsTrigger>
            <TabsTrigger value="tips" className="rounded-lg text-sm">Economia</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ExpenseCategoryChart />
              <ExpenseTrendChart />
            </div>
            
            {/* Transações Recentes */}
            <RecentTransactions />
            
            {/* Simulador Financeiro */}
            <SimulatorCard />
          </TabsContent>
          
          <TabsContent value="goals" className="animate-fade-in">
            <GoalsCard />
          </TabsContent>
          
          <TabsContent value="tips" className="animate-fade-in">
            <EconomyTips />
          </TabsContent>
        </Tabs>
        
        {/* Links para mais funcionalidades */}
        <div className="flex justify-between items-center mb-20">
          <Link 
            to="/analise-ia" 
            className="inline-flex items-center text-finance-primary hover:text-finance-accent transition-colors text-sm font-medium"
          >
            <Brain className="mr-1 h-4 w-4" />
            Análise com IA
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link 
            to="/planejamento" 
            className="inline-flex items-center text-finance-accent hover:text-finance-primary transition-colors text-sm font-medium"
          >
            Planejamento financeiro
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {/* Botão flutuante de sugestões */}
        <SuggestionsButton />
        
        {/* Assistente em tempo real */}
        <ChatAssistant />
      </div>
    </div>
  );
};

export default Index;
