
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, SendHorizontal, Sparkles, Camera, Mic, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ExpenseInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Simulando o processamento do input
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      toast({
        title: "Transação registrada!",
        description: `"${input}" foi adicionado com sucesso.`,
        duration: 3000,
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        setInput('');
      }, 1500);
    }, 1500);
  };

  return (
    <Card className="mb-8 rounded-3xl shadow-md border-none overflow-hidden transition-shadow duration-300 hover:shadow-lg dark:bg-finance-text/10 dark:border dark:border-white/10">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="text-left mb-1 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-finance-accent" />
            <label className="text-sm font-medium text-finance-text dark:text-white">
              Registrar transação
            </label>
          </div>
          <div className="relative flex items-center">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white rounded-xl dark:bg-finance-text/20"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle className="h-10 w-10 text-finance-success" />
                    </motion.div>
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-medium mt-2 text-finance-success"
                    >
                      Registrado com sucesso!
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.input
                  key="input"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Ex: "Gastei R$80 com mercado hoje"'
                  className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text w-full pr-24 focus:outline-none focus:ring-2 focus:ring-finance-primary/50 dark:bg-finance-text/20 dark:text-white dark:placeholder-white/50"
                  disabled={isProcessing}
                />
              )}
            </AnimatePresence>
            <div className="absolute right-2 flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="submit" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg bg-finance-primary hover:bg-finance-accent text-white shadow-sm"
                      disabled={!input.trim() || isProcessing || isSuccess}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SendHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Enviar transação</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      type="button" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg bg-finance-light hover:bg-muted border-none dark:bg-white/10 dark:hover:bg-white/20"
                    >
                      <Search className="h-4 w-4 text-finance-accent" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Buscar transações</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="lg:flex space-x-1 hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-finance-light hover:bg-muted border-none dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        <Camera className="h-4 w-4 text-finance-accent" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Escanear nota</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg bg-finance-light hover:bg-muted border-none dark:bg-white/10 dark:hover:bg-white/20"
                      >
                        <Mic className="h-4 w-4 text-finance-accent" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Usar voz</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-left italic">
            Use linguagem natural para registrar suas despesas ou receitas.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
