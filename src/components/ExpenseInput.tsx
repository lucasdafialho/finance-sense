import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFinancialData } from '@/hooks/use-financial-data';
import { motion, AnimatePresence } from 'framer-motion';

export const ExpenseInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { addTransactionFromInput, parseNaturalLanguageInput } = useFinancialData();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || isSuccess) return;
    
    setIsProcessing(true);
    
    // Simular processamento com delay
    setTimeout(() => {
      const parsedTransaction = parseNaturalLanguageInput(input);
      
      if (parsedTransaction && addTransactionFromInput(input)) {
        setIsProcessing(false);
        setIsSuccess(true);
        
        toast({
          title: `${parsedTransaction.type === 'income' ? '💰 Receita' : '💸 Despesa'} registrada!`,
          description: `R$ ${parsedTransaction.amount.toFixed(2)} - ${parsedTransaction.category}`,
          duration: 3000,
        });
        
        // Reset após sucesso
        setTimeout(() => {
          setIsSuccess(false);
          setInput('');
        }, 2000);
      } else {
        setIsProcessing(false);
        toast({
          title: "❌ Formato não reconhecido",
          description: "Use: 'Gastei R$50 no mercado' ou 'Recebi R$100 de salário'",
          variant: "destructive",
          duration: 4000,
        });
      }
    }, 800);
  };

  return (
    <Card className="mb-8 rounded-3xl shadow-md border-none overflow-hidden transition-shadow duration-300 hover:shadow-lg dark:bg-card">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center mb-2">
            <Sparkles className="h-4 w-4 mr-2 text-finance-accent" />
            <label className="text-sm font-medium text-finance-text dark:text-card-foreground">
              Registrar transação
            </label>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center bg-white rounded-xl p-4 dark:bg-card dark:border dark:border-border/50"
                >
                  <CheckCircle className="h-8 w-8 text-finance-success mr-3" />
                  <span className="text-finance-success font-medium">✅ Registrado com sucesso!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Ex: "Gastei R$80 com mercado hoje" ou "Recebi R$1500 de salário"'
                    className="flex-1 rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary/50 dark:bg-muted dark:text-card-foreground dark:placeholder-muted-foreground"
                    disabled={isProcessing}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-12 w-12 rounded-xl bg-finance-primary hover:bg-finance-accent text-white shadow-sm disabled:opacity-50"
                    disabled={!input.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="text-xs text-muted-foreground">
            💡 <strong>Use linguagem natural:</strong> "Gastei R$50 no supermercado", "Recebi R$100 de freelance"
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
