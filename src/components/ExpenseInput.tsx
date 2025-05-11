
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ExpenseInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Simulando o processamento do input
    toast({
      title: "Transação registrada!",
      description: `"${input}" foi adicionado com sucesso.`,
      duration: 3000,
    });
    
    setInput('');
  };

  return (
    <Card className="finance-card mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="text-left mb-1">
            <label className="text-sm font-medium text-finance-accent">
              Registrar transação
            </label>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ex: "Gastei R$80 com mercado hoje"'
              className="finance-input w-full pr-24"
            />
            <div className="absolute right-2 flex space-x-2">
              <Button 
                type="submit" 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg bg-finance-light hover:bg-finance-secondary border-none"
                title="Enviar"
              >
                <Plus className="h-4 w-4 text-finance-accent" />
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg bg-finance-light hover:bg-finance-secondary border-none"
                title="Buscar transações"
              >
                <Search className="h-4 w-4 text-finance-accent" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-left">
            Use linguagem natural para registrar suas despesas ou receitas.
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
