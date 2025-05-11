
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Pencil, Calendar } from 'lucide-react';
import { financialGoals } from '@/data/mockData';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';

export const GoalsCard: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-secondary p-6 pb-8">
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
            <DialogContent className="rounded-3xl border-none shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-center">Novo Objetivo Financeiro</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Formulário simples de criação de objetivo */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-name" className="text-sm font-medium">Descrição</label>
                  <input
                    id="goal-name"
                    type="text"
                    placeholder="Viagem, Emergência, Investimento..."
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-amount" className="text-sm font-medium">Valor (R$)</label>
                  <input
                    id="goal-amount"
                    type="number"
                    placeholder="0,00"
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="goal-date" className="text-sm font-medium">Data alvo</label>
                  <input
                    id="goal-date"
                    type="date"
                    className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text focus:outline-none focus:ring-2 focus:ring-finance-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl bg-finance-primary hover:bg-finance-accent"
                >
                  Criar Objetivo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 -mt-4 bg-white">
        <div className="space-y-6">
          {financialGoals.map((goal, index) => (
            <motion.div 
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                  <span className="bg-finance-light p-2 rounded-full">
                    <Target className="h-4 w-4 text-finance-accent" />
                  </span>
                  <h4 className="font-medium">{goal.title}</h4>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{goal.targetDate}</span>
                </div>
                <span className="font-semibold">
                  {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                </span>
              </div>
              
              <Progress 
                value={(goal.currentAmount / goal.targetAmount) * 100}
                className="h-2 mb-2" 
              />
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>R$ {goal.currentAmount.toLocaleString('pt-BR')}</span>
                <span>Meta: R$ {goal.targetAmount.toLocaleString('pt-BR')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
