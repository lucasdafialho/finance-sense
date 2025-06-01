import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Pencil, Calendar } from 'lucide-react';
import { financialGoals as mockGoals } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  targetDate: string;
  category?: string;
  isFromSuggestion?: boolean;
}

export const GoalsCard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    date: ''
  });
  const { toast } = useToast();
  
  const loadGoals = () => {
    try {
      const localGoals = JSON.parse(localStorage.getItem('financeSenseGoals') || '[]');
      
      if (localGoals.length > 0) {
        setGoals(localGoals);
      } else {
        // Usar dados mock se não houver metas reais
        setGoals(mockGoals);
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      setGoals(mockGoals);
    }
  };

  const createGoal = () => {
    if (!newGoal.title.trim() || !newGoal.amount || !newGoal.date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar a meta.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoal.title.trim(),
      currentAmount: 0,
      targetAmount: parseFloat(newGoal.amount),
      targetDate: new Date(newGoal.date).toLocaleDateString('pt-BR'),
      category: 'pessoal'
    };

    try {
      const updatedGoals = [...goals, goal];
      setGoals(updatedGoals);
      localStorage.setItem('financeSenseGoals', JSON.stringify(updatedGoals));
      
      setNewGoal({ title: '', amount: '', date: '' });
      setOpen(false);
      
      toast({
        title: "Meta criada com sucesso!",
        description: `Meta "${goal.title}" adicionada às suas metas financeiras.`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast({
        title: "Erro ao criar meta",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadGoals();

    // Escutar mudanças nas sugestões aplicadas
    const handleSuggestionApplied = () => {
      loadGoals();
    };

    window.addEventListener('suggestionApplied', handleSuggestionApplied);

    return () => {
      window.removeEventListener('suggestionApplied', handleSuggestionApplied);
    };
  }, []);

  return (
    <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-secondary p-6 pb-8 text-white dark:from-finance-primary/90 dark:to-finance-secondary/90">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-white" />
            <CardTitle className="text-xl font-bold text-white">Objetivos Financeiros</CardTitle>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30 text-white">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-none shadow-lg dark:bg-card dark:text-card-foreground">
              <DialogHeader>
                <DialogTitle className="text-center">Novo Objetivo Financeiro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-name" className="text-sm font-medium">Descrição</label>
                  <input
                    id="goal-name"
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Viagem, Emergência, Investimento..."
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-white dark:placeholder-white/50 dark:focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-amount" className="text-sm font-medium">Valor (R$)</label>
                  <input
                    id="goal-amount"
                    type="number"
                    value={newGoal.amount}
                    onChange={(e) => setNewGoal({ ...newGoal, amount: e.target.value })}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-white dark:placeholder-white/50 dark:focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-date" className="text-sm font-medium">Data alvo</label>
                  <input
                    id="goal-date"
                    type="date"
                    value={newGoal.date}
                    onChange={(e) => setNewGoal({ ...newGoal, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-white dark:focus:ring-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={createGoal}
                  className="w-full rounded-xl bg-finance-primary hover:bg-finance-accent"
                >
                  Criar Objetivo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 -mt-4 bg-white dark:bg-card">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nenhuma meta definida</p>
            <p className="text-sm">Clique no botão + para criar seu primeiro objetivo financeiro!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal, index) => {
              const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              const isFromSuggestion = goal.isFromSuggestion || goal.title.includes('💰') || goal.category === 'economia';
              
              return (
                <motion.div 
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 dark:bg-muted dark:hover:bg-muted/80 ${isFromSuggestion ? 'border-l-4 border-finance-accent' : ''}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <span className={`p-2 rounded-full ${isFromSuggestion ? 'bg-finance-accent/20' : 'bg-finance-light'} dark:bg-primary/10`}>
                        <Target className={`h-4 w-4 ${isFromSuggestion ? 'text-finance-accent' : 'text-finance-accent'}`} />
                      </span>
                      <h4 className="font-medium dark:text-card-foreground">{goal.title}</h4>
                    </div>
                    {!isFromSuggestion && (
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 dark:text-muted-foreground dark:hover:bg-primary/10">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{goal.targetDate}</span>
                    </div>
                    <span className="font-semibold">
                      {progress}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={progress}
                    className="h-2 mb-2" 
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
                    <span>Meta: R$ {goal.targetAmount.toLocaleString('pt-BR')}</span>
                  </div>
                  
                  {isFromSuggestion && (
                    <div className="mt-2 text-xs text-finance-accent bg-finance-light/50 px-2 py-1 rounded-md dark:bg-primary/10 dark:text-primary">
                      📊 Meta criada a partir de sugestão de economia
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
