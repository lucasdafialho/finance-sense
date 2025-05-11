
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { financialSimulations } from '@/data/mockData';

export const SimulatorCard: React.FC = () => {
  const [selectedSimulation, setSelectedSimulation] = useState(financialSimulations[0]);
  const [amount, setAmount] = useState(selectedSimulation.defaultAmount);
  const [months, setMonths] = useState(selectedSimulation.defaultMonths);
  
  const handleSimulationChange = (simulationId: string) => {
    const simulation = financialSimulations.find(sim => sim.id === simulationId);
    if (simulation) {
      setSelectedSimulation(simulation);
      setAmount(simulation.defaultAmount);
      setMonths(simulation.defaultMonths);
    }
  };
  
  // Cálculo baseado no tipo de simulação
  const calculateResult = () => {
    switch (selectedSimulation.id) {
      case 'delivery':
        return (amount * months).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
      case 'coffee':
        return (amount * 20 * months).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
      case 'subscription':
        return (amount * months).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
      default:
        return '0';
    }
  };
  
  return (
    <Card className="rounded-3xl shadow-md border-none overflow-hidden mb-6">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center mb-1">
          <Calculator className="h-5 w-5 mr-2 text-finance-purple" />
          <CardTitle className="text-lg font-semibold">Simulador Financeiro</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Descubra o impacto de pequenas mudanças no seu orçamento
        </p>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {financialSimulations.map((simulation) => (
            <Button 
              key={simulation.id}
              variant={selectedSimulation.id === simulation.id ? "default" : "outline"}
              className={`rounded-xl text-xs h-auto py-3 ${
                selectedSimulation.id === simulation.id 
                  ? 'bg-finance-primary text-white' 
                  : 'border-muted'
              }`}
              onClick={() => handleSimulationChange(simulation.id)}
            >
              {simulation.name}
            </Button>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Valor mensal (R$)</label>
              <span className="text-sm font-bold text-finance-accent">R$ {amount}</span>
            </div>
            <Slider 
              value={[amount]} 
              min={selectedSimulation.minAmount}
              max={selectedSimulation.maxAmount}
              step={selectedSimulation.step}
              onValueChange={(values) => setAmount(values[0])}
              className="py-4"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Período (meses)</label>
              <span className="text-sm font-bold text-finance-accent">{months} meses</span>
            </div>
            <Slider 
              value={[months]} 
              min={1}
              max={36}
              step={1}
              onValueChange={(values) => setMonths(values[0])}
              className="py-4"
            />
          </div>
          
          <div className="bg-finance-light rounded-2xl p-4 border border-finance-primary/20">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 mr-2 text-finance-accent" />
              <h4 className="text-sm font-semibold">Resultado da simulação</h4>
            </div>
            <p className="text-sm mb-2">
              {selectedSimulation.resultText
                .replace('{amount}', amount.toString())
                .replace('{months}', months.toString())}
            </p>
            <p className="text-xl font-bold text-finance-primary flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-finance-warning" />
              R$ {calculateResult()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
