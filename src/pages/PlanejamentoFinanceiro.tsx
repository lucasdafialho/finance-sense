import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { FeedbackMessage } from '@/components/FeedbackMessage';
import { GoalsCard } from '@/components/GoalsCard';
import { SimulatorCard } from '@/components/SimulatorCard';
import { SuggestionsButton } from '@/components/SuggestionsButton';
import { ChatAssistant } from '@/components/ChatAssistant';
import { Plus, Lightbulb, ArrowLeft, TrendingUp, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Adicione dados de exemplo aqui
const suggestedGoals = [
  { id: 'sg1', title: 'Fundo de emergência', description: 'Crie uma reserva equivalente a 6 meses de gastos', value: 12000 },
  { id: 'sg2', title: 'Troca de celular', description: 'Economize para um novo smartphone', value: 3500 },
  { id: 'sg3', title: 'Viagem', description: 'Férias para relaxar e recarregar energias', value: 5000 },
];

const PlanejamentoFinanceiro: React.FC = () => {
  const [showSuggestedGoalDialog, setShowSuggestedGoalDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleScheduleReview = () => {
    toast({
      title: "📅 Revisão Agendada!",
      description: "Você será lembrado para revisar suas finanças no próximo mês.",
      duration: 4000,
    });
  };
  
  const handleGenerateReport = () => {
    navigate('/analise-ia');
    toast({
      title: "📊 Gerando Relatório",
      description: "Você será redirecionado para a análise com IA.",
      duration: 3000,
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-finance-light to-white px-4 py-6 sm:px-6 md:py-8 dark:from-background dark:to-background">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <div className="flex items-center mb-6">
          <a href="/" className="flex items-center text-finance-accent hover:text-finance-primary mr-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="text-sm">Voltar</span>
          </a>
          <h1 className="text-2xl font-bold text-finance-text dark:text-white">Planejamento Financeiro</h1>
        </div>
        
        <FeedbackMessage 
          type="progress" 
          message="Você está no caminho certo! Continue acompanhando seus objetivos regularmente."
        />
        
        <GoalsCard />
        
        <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6">
          <CardHeader className="bg-finance-light p-6 pb-4">
            <div className="flex items-center mb-1">
              <Lightbulb className="h-5 w-5 mr-2 text-finance-warning" />
              <CardTitle className="text-lg font-semibold">Metas Sugeridas para Você</CardTitle>
            </div>
            <CardDescription>
              Com base no seu perfil financeiro, estas metas podem te ajudar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {suggestedGoals.map((goal) => (
                <motion.div 
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-muted/30 flex justify-between items-center dark:bg-card dark:text-card-foreground"
                >
                  <div>
                    <div className="flex items-center mb-1">
                      <Target className="h-4 w-4 mr-2 text-finance-accent" />
                      <h4 className="font-medium text-finance-text dark:text-white">{goal.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-finance-primary mr-3">
                      R$ {goal.value.toLocaleString('pt-BR')}
                    </span>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 border-finance-primary text-finance-primary hover:bg-finance-primary/10"
                      onClick={() => setShowSuggestedGoalDialog(true)}
                    >
                      Adicionar
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <SimulatorCard />
        
        <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-20">
          <CardContent className="p-6">
            <Alert className="bg-finance-purple/10 border-none mb-4">
              <TrendingUp className="h-5 w-5 text-finance-purple" />
              <AlertTitle className="text-finance-text dark:text-white">
                Conquiste seus objetivos financeiros
              </AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground">
                Pequenos hábitos diários podem levar a grandes resultados. Acompanhe seu progresso regularmente e ajuste suas estratégias quando necessário.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button 
                className="flex-1 bg-finance-primary hover:bg-finance-accent text-white rounded-xl py-6"
                onClick={handleScheduleReview}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agendar revisão mensal
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-finance-primary text-finance-primary hover:bg-finance-primary/10 rounded-xl py-6"
                onClick={handleGenerateReport}
              >
                <Target className="h-5 w-5 mr-2" />
                Gerar relatório detalhado
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={showSuggestedGoalDialog} onOpenChange={setShowSuggestedGoalDialog}>
          <DialogContent className="rounded-3xl border-none shadow-lg">
            <DialogHeader>
              <DialogTitle>Adicionar Meta Sugerida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Formulário simplificado */}
              <div className="flex flex-col space-y-2">
                <label htmlFor="goal-name" className="text-sm font-medium">Descrição</label>
                <input
                  id="goal-name"
                  type="text"
                  defaultValue="Fundo de emergência"
                  className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-foreground dark:placeholder-muted-foreground"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="goal-amount" className="text-sm font-medium">Valor (R$)</label>
                <input
                  id="goal-amount"
                  type="number"
                  defaultValue="12000"
                  className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-foreground dark:placeholder-muted-foreground"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="goal-date" className="text-sm font-medium">Data alvo</label>
                <input
                  id="goal-date"
                  type="date"
                  className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary dark:bg-muted dark:text-foreground"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => {
                  const goalName = (document.getElementById('goal-name') as HTMLInputElement)?.value;
                  const goalAmount = parseFloat((document.getElementById('goal-amount') as HTMLInputElement)?.value || '0');
                  const goalDate = (document.getElementById('goal-date') as HTMLInputElement)?.value;
                  
                  if (goalName && goalAmount > 0 && goalDate) {
                    const existingGoals = JSON.parse(localStorage.getItem('financeSenseGoals') || '[]');
                    const newGoal = {
                      id: `goal-${Date.now()}`,
                      title: goalName,
                      targetAmount: goalAmount,
                      currentAmount: 0,
                      targetDate: new Date(goalDate).toLocaleDateString('pt-BR'),
                      category: 'meta-sugerida'
                    };
                    
                    existingGoals.push(newGoal);
                    localStorage.setItem('financeSenseGoals', JSON.stringify(existingGoals));
                    
                    toast({
                      title: "🎯 Meta Criada!",
                      description: `Meta "${goalName}" foi adicionada com sucesso!`,
                      duration: 4000,
                    });
                    
                    setShowSuggestedGoalDialog(false);
                    window.location.reload();
                  } else {
                    toast({
                      title: "⚠️ Preencha todos os campos",
                      description: "Por favor, preencha todos os campos para criar a meta.",
                      variant: "destructive",
                      duration: 3000,
                    });
                  }
                }}
                className="w-full rounded-xl bg-finance-primary hover:bg-finance-accent"
              >
                Adicionar Meta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <SuggestionsButton />
        <ChatAssistant />
      </div>
    </div>
  );
};

export default PlanejamentoFinanceiro;
