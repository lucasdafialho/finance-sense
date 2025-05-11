
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, SendHorizontal, Sparkles } from 'lucide-react';
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
    <Card className="mb-8 rounded-3xl shadow-md border-none overflow-hidden">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="text-left mb-1 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-finance-accent" />
            <label className="text-sm font-medium text-finance-text">
              Registrar transação
            </label>
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Ex: "Gastei R$80 com mercado hoje"'
              className="rounded-xl border-0 shadow-sm bg-white px-4 py-3 text-finance-text w-full pr-24 focus:outline-none focus:ring-2 focus:ring-finance-primary"
            />
            <div className="absolute right-2 flex space-x-2">
              <Button 
                type="submit" 
                size="icon" 
                className="h-8 w-8 rounded-lg bg-finance-primary hover:bg-finance-accent text-white shadow-sm"
                title="Enviar"
              >
                <SendHorizontal className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                size="icon" 
                className="h-8 w-8 rounded-lg bg-finance-light hover:bg-muted border-none"
                title="Buscar transações"
              >
                <Search className="h-4 w-4 text-finance-accent" />
              </Button>
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
