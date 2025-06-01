import React from 'react';
import { Header } from '@/components/Header';
import { AIFinancialAnalyzer } from '@/components/AIFinancialAnalyzer';
import { InvestmentOptimizer } from '@/components/InvestmentOptimizer';
import { SmartReports } from '@/components/SmartReports';
import { ChatAssistant } from '@/components/ChatAssistant';
import { SuggestionsButton } from '@/components/SuggestionsButton';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnaliseIA: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white px-4 py-6 sm:px-6 md:py-8 dark:from-background dark:to-background">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="flex items-center mb-8">
          <Link 
            to="/" 
            className="flex items-center text-finance-accent hover:text-finance-primary mr-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Voltar</span>
          </Link>
          <div className="flex items-center">
            <Brain className="h-8 w-8 mr-3 text-finance-primary" />
            <div>
              <h1 className="text-3xl font-bold text-finance-text dark:text-white">
                Análise Financeira com IA
              </h1>
              <p className="text-finance-accent dark:text-finance-secondary">
                Insights inteligentes para suas finanças
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-finance-primary/10 to-finance-accent/10 p-6 rounded-3xl border border-finance-primary/20"
        >
          <div className="flex items-center mb-3">
            <Sparkles className="h-6 w-6 mr-2 text-finance-primary" />
            <h2 className="text-xl font-semibold text-finance-text dark:text-white">
              Central de Inteligência Financeira
            </h2>
          </div>
          <p className="text-muted-foreground">
            Nossa IA analisa seus dados financeiros em tempo real, oferecendo insights personalizados,
            previsões precisas e recomendações estratégicas para otimizar suas finanças.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AIFinancialAnalyzer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InvestmentOptimizer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SmartReports />
          </motion.div>
        </div>

        <div className="mt-12 mb-20">
          <div className="bg-gradient-to-r from-finance-light/50 to-finance-secondary/50 p-6 rounded-3xl text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-finance-primary" />
            <h3 className="text-xl font-semibold mb-2 text-finance-text">
              IA em Constante Aprendizado
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nossa inteligência artificial aprende continuamente com seus padrões financeiros,
              oferecendo recomendações cada vez mais precisas e personalizadas para seu perfil único.
            </p>
          </div>
        </div>

        <SuggestionsButton />
        <ChatAssistant />
      </div>
    </div>
  );
};

export default AnaliseIA; 