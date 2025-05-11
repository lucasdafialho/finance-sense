
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PiggyBank } from 'lucide-react';
import { savingSuggestions } from '@/data/mockData';
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
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-finance-accent hover:bg-finance-primary shadow-lg flex items-center justify-center animate-float"
            aria-label="Sugestões de economia"
          >
            <PiggyBank className="h-6 w-6 text-white" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-finance-text">
              Sugestões de Economia
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {savingSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="p-4 rounded-xl hover:bg-finance-light transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-finance-text">{suggestion.title}</h3>
                  <span className="text-finance-success font-bold text-sm">
                    Economia: R$ {suggestion.potentialSavings}/mês
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </Card>
            ))}
            <div className="flex justify-center pt-2">
              <Button 
                className="rounded-xl bg-finance-primary hover:bg-finance-accent text-white"
                onClick={() => setOpen(false)}
              >
                Aplicar Sugestões
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
