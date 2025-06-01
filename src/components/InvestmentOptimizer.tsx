import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  PieChart, 
  Target, 
  Calculator,
  Loader2,
  DollarSign,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService, type InvestmentRecommendation } from '@/services/geminiService';

export const InvestmentOptimizer: React.FC = () => {
  const [amount, setAmount] = useState([5000]);
  const [profile, setProfile] = useState('');
  const [timeHorizon, setTimeHorizon] = useState('');
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateLocalRecommendations = (investorProfile: string, investmentAmount: number, horizon: string): InvestmentRecommendation[] => {
    const profiles = {
      conservador: {
        rendaFixa: 70,
        fundos: 20,
        acoes: 10
      },
      moderado: {
        rendaFixa: 50,
        fundos: 30,
        acoes: 20
      },
      arrojado: {
        rendaFixa: 30,
        fundos: 30,
        acoes: 40
      }
    };
    
    const profileData = profiles[investorProfile as keyof typeof profiles] || profiles.moderado;
    
    const recommendations: InvestmentRecommendation[] = [];
    
    if (profileData.rendaFixa > 0) {
      recommendations.push({
        type: 'Renda Fixa',
        allocation: profileData.rendaFixa,
        risk: 'baixo',
        expectedReturn: '8% a 12%',
        description: 'Tesouro Selic, CDBs, LCI/LCA - Baixo risco e liquidez'
      });
    }
    
    if (profileData.fundos > 0) {
      recommendations.push({
        type: 'Fundos Multimercado',
        allocation: profileData.fundos,
        risk: 'médio',
        expectedReturn: '10% a 15%',
        description: 'Diversificação profissional com gestão ativa'
      });
    }
    
    if (profileData.acoes > 0) {
      recommendations.push({
        type: 'Ações e ETFs',
        allocation: profileData.acoes,
        risk: 'alto',
        expectedReturn: '15% a 25%',
        description: 'Potencial de alta rentabilidade no longo prazo'
      });
    }
    
    return recommendations;
  };

  const generateRecommendations = async () => {
    if (!profile || !timeHorizon) return;
    
    setIsLoading(true);
    try {
      const result = await geminiService.generateInvestmentRecommendations(
        profile,
        amount[0],
        timeHorizon
      );
      setRecommendations(result);
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      
      // Gerar recomendações locais como fallback
      const localRecommendations = generateLocalRecommendations(profile, amount[0], timeHorizon);
      setRecommendations(localRecommendations);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'baixo': return <Shield className="h-4 w-4 text-green-600" />;
      case 'médio': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'alto': return <Zap className="h-4 w-4 text-red-600" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'baixo': return 'bg-green-100 text-green-800 border-green-200';
      case 'médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'alto': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-muted dark:text-muted-foreground dark:border-border';
    }
  };

  const totalReturn = recommendations.reduce((sum, rec) => {
    const returnNum = parseFloat(rec.expectedReturn.replace(/[^\d,]/g, '').replace(',', '.'));
    return sum + (returnNum * rec.allocation / 100);
  }, 0);

  return (
    <Card className="rounded-3xl shadow-lg border-none overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-finance-accent to-finance-primary p-6 text-white">
        <div className="flex items-center">
          <PieChart className="h-6 w-6 mr-3" />
          <div>
            <CardTitle className="text-xl font-bold">Otimizador de Investimentos</CardTitle>
            <p className="text-white/80 text-sm">Recomendações personalizadas com IA</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor para investir</Label>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">R$ 1.000</span>
                  <span className="text-lg font-bold text-finance-primary">
                    R$ {amount[0].toLocaleString('pt-BR')}
                  </span>
                  <span className="text-sm text-muted-foreground">R$ 100.000</span>
                </div>
                <Slider
                  value={amount}
                  onValueChange={setAmount}
                  min={1000}
                  max={100000}
                  step={500}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile">Perfil de investidor</Label>
              <Select value={profile} onValueChange={setProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservador">Conservador</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="arrojado">Arrojado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeHorizon">Prazo do investimento</Label>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6 meses">6 meses</SelectItem>
                  <SelectItem value="1 ano">1 ano</SelectItem>
                  <SelectItem value="2 anos">2 anos</SelectItem>
                  <SelectItem value="5 anos">5 anos</SelectItem>
                  <SelectItem value="10 anos">10+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateRecommendations}
            disabled={!profile || !timeHorizon || isLoading}
            className="w-full bg-finance-primary hover:bg-finance-accent text-white py-3 rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analisando opções de investimento...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Gerar Recomendações
              </>
            )}
          </Button>

          <AnimatePresence>
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-finance-light/40 to-finance-secondary/40 p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Retorno Estimado da Carteira</h3>
                    <Target className="h-5 w-5 text-finance-primary" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-finance-primary">{totalReturn.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">ao ano</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-finance-success">
                        R$ {(amount[0] * totalReturn / 100).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">retorno anual</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-finance-accent">
                        R$ {(amount[0] + amount[0] * totalReturn / 100).toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm text-muted-foreground">total em 1 ano</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Distribuição Recomendada</h3>
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-muted rounded-2xl p-4 hover:shadow-md transition-shadow dark:bg-card dark:border-border"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-finance-primary mr-3"></div>
                          <h4 className="font-semibold">{rec.type}</h4>
                          <Badge 
                            variant="outline" 
                            className={`ml-2 ${getRiskColor(rec.risk)}`}
                          >
                            {getRiskIcon(rec.risk)}
                            <span className="ml-1">{rec.risk}</span>
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-finance-primary">{rec.allocation}%</p>
                          <p className="text-sm text-muted-foreground">{rec.expectedReturn}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={rec.allocation} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">{rec.description}</p>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-finance-success mr-1" />
                          <span className="font-medium">
                            R$ {(amount[0] * rec.allocation / 100).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-finance-light/30 p-4 rounded-xl">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Clock className="h-5 w-5 text-finance-primary mr-2" />
                    Dicas para Seus Investimentos
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Diversifique seus investimentos para reduzir riscos</li>
                    <li>• Reavalie sua carteira periodicamente</li>
                    <li>• Mantenha uma reserva de emergência</li>
                    <li>• Considere os custos e impostos envolvidos</li>
                    <li>• Invista apenas o que pode deixar aplicado</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}; 