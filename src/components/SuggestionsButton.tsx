
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PiggyBank, TrendingUp } from 'lucide-react';
import { savingSuggestions } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const SuggestionsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-finance-accent hover:bg-finance-primary text-white shadow-lg flex items-center justify-center animate-float"
            aria-label="Sugestões de economia"
          >
            <PiggyBank className="h-7 w-7" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg rounded-3xl p-0 border-none shadow-xl overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold">
                Sugestões de Economia
              </DialogTitle>
              <p className="text-center text-sm opacity-90 mt-1">
                Otimize seus gastos com nossas recomendações personalizadas
              </p>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
            {savingSuggestions.map((suggestion, index) => (
              <React.Fragment key={suggestion.id}>
                <Card className="p-4 rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-finance-light p-2 rounded-full mr-3">
                        <TrendingUp className="h-5 w-5 text-finance-accent" />
                      </div>
                      <h3 className="font-semibold text-finance-text">{suggestion.title}</h3>
                    </div>
                    <span className="text-finance-success font-bold text-sm bg-finance-light/70 px-2 py-0.5 rounded-md">
                      R$ {suggestion.potentialSavings}/mês
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-12">{suggestion.description}</p>
                </Card>
                {index < savingSuggestions.length - 1 && (
                  <Separator className="my-2 opacity-30" />
                )}
              </React.Fragment>
            ))}
            <div className="flex justify-center pt-4">
              <Button 
                className="rounded-xl px-8 py-6 bg-finance-accent hover:bg-finance-primary text-white font-semibold shadow-md"
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
