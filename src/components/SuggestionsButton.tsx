import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { savingSuggestions } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from '@/components/ui/card';

export const SuggestionsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('financeSenseAppliedSuggestions') || '[]');
    } catch {
      return [];
    }
  });
  const { toast } = useToast();
  
  const handleApplySuggestion = async (suggestion: any) => {
    if (isApplying) return;
    
    setIsApplying(true);
    setSelectedSuggestion(suggestion.id);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Salvar sugestão aplicada
      const newApplied = [...appliedSuggestions, suggestion.id];
      setAppliedSuggestions(newApplied);
      localStorage.setItem('financeSenseAppliedSuggestions', JSON.stringify(newApplied));
      
      // Criar meta de economia
      const existingGoals = JSON.parse(localStorage.getItem('financeSenseGoals') || '[]');
      const savingsGoal = {
        id: `goal-suggestion-${suggestion.id}-${Date.now()}`,
        title: `💰 ${suggestion.title}`,
        targetAmount: suggestion.potentialSavings * 6, // 6 meses de economia
        currentAmount: 0,
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        category: 'economia'
      };
      
      existingGoals.push(savingsGoal);
      localStorage.setItem('financeSenseGoals', JSON.stringify(existingGoals));
      
      toast({
        title: "Sugestão aplicada com sucesso!",
        description: `Meta criada: economizar R$ ${suggestion.potentialSavings}/mês`,
        duration: 4000,
      });
      
      // Fechar dialog
      setTimeout(() => {
        setOpen(false);
        setSelectedSuggestion(null);
      }, 1000);
      
      // Disparar evento
      window.dispatchEvent(new CustomEvent('suggestionApplied', { 
        detail: { id: suggestion.id, title: suggestion.title }
      }));
      
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      toast({
        title: "Erro ao aplicar sugestão",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsApplying(false);
      setSelectedSuggestion(null);
    }
  };
  
  const availableSuggestions = savingSuggestions.filter(s => 
    !appliedSuggestions.includes(s.id)
  );
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 left-6 rounded-full w-16 h-16 bg-finance-accent hover:bg-finance-primary text-white shadow-lg transition-all duration-300 hover:scale-105 z-40"
            aria-label="Sugestões de economia"
          >
            <PiggyBank className="h-7 w-7" />
            {availableSuggestions.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {availableSuggestions.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-lg rounded-2xl border-none shadow-xl overflow-hidden bg-white dark:bg-card">
          <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                💡 Sugestões de Economia
              </DialogTitle>
              <p className="text-center text-sm opacity-90 mt-1">
                Aplique essas dicas para economizar mais
              </p>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
            {availableSuggestions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-finance-success mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-finance-text dark:text-card-foreground mb-2">
                  🎉 Todas as sugestões aplicadas!
                </h3>
                <p className="text-muted-foreground">
                  Você está no caminho certo para uma vida financeira mais saudável!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className="p-4 hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 dark:border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-finance-light p-2 rounded-full mr-3 dark:bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-finance-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-finance-text dark:text-card-foreground">
                            {suggestion.title}
                          </h3>
                          <span className="text-finance-success font-bold text-sm bg-finance-light/70 px-2 py-1 rounded-md dark:bg-success/10 dark:text-success">
                            💰 R$ {suggestion.potentialSavings}/mês
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {suggestion.description}
                    </p>
                    
                    <Button 
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={isApplying}
                      className="w-full bg-finance-accent hover:bg-finance-primary text-white font-medium py-2 disabled:opacity-50"
                    >
                      {isApplying && selectedSuggestion === suggestion.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Aplicando...
                        </>
                      ) : (
                        '✅ Aplicar Esta Sugestão'
                      )}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
            
            {appliedSuggestions.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 dark:border-border">
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-finance-success" />
                  {appliedSuggestions.length} sugestão(ões) já aplicada(s)
                </p>
                <div className="text-xs text-muted-foreground">
                  Continue acompanhando suas metas na aba "Objetivos" 📊
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
