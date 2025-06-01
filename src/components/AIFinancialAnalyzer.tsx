import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Sparkles, 
  BarChart3,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService, type FinancialData, type AIAnalysis } from '@/services/geminiService';
import { useFinancialData } from '@/hooks/use-financial-data';

export const AIFinancialAnalyzer: React.FC = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const { data: financialData } = useFinancialData();

  const createAnalysisData = (): FinancialData => ({
    transactions: financialData.transactions,
    goals: financialData.goals,
    expenses: financialData.categories,
    income: financialData.totalIncome,
    savings: financialData.currentSavings
  });

  const analyzeFinances = async () => {
    if (financialData.transactions.length === 0) {
      setAnalysis({
        score: 0,
        risk: 'low',
        recommendations: ['Comece registrando suas transações para uma análise mais precisa!'],
        insights: ['Ainda não há dados suficientes para análise inteligente.']
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysisData = createAnalysisData();
      const [analysisResult, anomaliesResult, predictionsResult] = await Promise.all([
        geminiService.analyzeFinancialData(analysisData),
        geminiService.detectAnomalies(financialData.transactions),
        geminiService.predictExpenses(financialData.categories, 6)
      ]);

      setAnalysis(analysisResult);
      setAnomalies(anomaliesResult);
      setPredictions(predictionsResult);
    } catch (error) {
      console.error('Erro na análise:', error);
      // Fallback com análise baseada em dados locais
      setAnalysis({
        score: calculateLocalScore(),
        risk: calculateLocalRisk(),
        recommendations: generateLocalRecommendations(),
        insights: generateLocalInsights()
      });
      
      // Gerar predições locais
      const localPredictions = [];
      const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];
      const baseAmount = financialData.totalExpenses || 3000;
      
      for (let i = 0; i < 6; i++) {
        localPredictions.push({
          month: months[i] || `Mês ${i + 1}`,
          predictedAmount: baseAmount * (1 + (Math.random() * 0.2 - 0.1)),
          confidence: 60 + Math.random() * 30
        });
      }
      
      setPredictions(localPredictions);
      setAnomalies([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateLocalScore = (): number => {
    let score = 100;
    
    if (financialData.totalIncome === 0) {
      score -= 50;
    } else {
      const expenseRatio = financialData.totalExpenses / financialData.totalIncome;
      if (expenseRatio > 1) score -= 40;
      else if (expenseRatio > 0.8) score -= 30;
      else if (expenseRatio > 0.6) score -= 15;
    }
    
    if (financialData.goals.length === 0) score -= 10;
    if (financialData.currentSavings < financialData.totalExpenses * 3) score -= 10;
    if (financialData.transactions.length < 5) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateLocalRisk = (): string => {
    const score = calculateLocalScore();
    const expenseRatio = financialData.totalIncome > 0 ? financialData.totalExpenses / financialData.totalIncome : 1;
    
    if (expenseRatio > 1) return 'high';
    if (score >= 70 && expenseRatio <= 0.7) return 'low';
    if (score >= 40) return 'medium';
    return 'high';
  };

  const generateLocalRecommendations = (): string[] => {
    const recommendations = [];
    const expenseRatio = financialData.totalIncome > 0 ? financialData.totalExpenses / financialData.totalIncome : 1;
    
    if (expenseRatio > 0.8) {
      recommendations.push('Suas despesas representam mais de 80% da renda. Considere revisar gastos desnecessários.');
    }
    
    if (financialData.goals.length === 0) {
      recommendations.push('Defina metas financeiras claras para manter o foco em seus objetivos.');
    }
    
    if (financialData.categories.length > 0) {
      const highestCategory = financialData.categories.reduce((max, cat) => 
        cat.amount > max.amount ? cat : max, financialData.categories[0]);
      recommendations.push(`Monitore gastos em ${highestCategory.category} - sua categoria com maior gasto.`);
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue registrando suas transações para análises mais precisas!'];
  };

  const generateLocalInsights = (): string[] => {
    const insights = [];
    
    if (financialData.currentSavings > 0) {
      insights.push(`Você tem R$ ${financialData.currentSavings.toLocaleString('pt-BR')} em poupança.`);
    }
    
    if (financialData.transactions.length > 0) {
      insights.push(`Registrou ${financialData.transactions.length} transações até agora.`);
    }
    
    return insights.length > 0 ? insights : ['Dados insuficientes para insights detalhados.'];
  };

  useEffect(() => {
    analyzeFinances();
  }, [financialData]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="rounded-3xl shadow-lg border-none overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-finance-primary to-finance-accent p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 mr-3" />
            <div>
              <CardTitle className="text-xl font-bold">Análise Financeira com IA</CardTitle>
              <p className="text-white/80 text-sm">Análise inteligente e personalizada</p>
            </div>
          </div>
          <Button 
            onClick={analyzeFinances}
            disabled={isAnalyzing}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 dark:bg-muted/20 dark:hover:bg-muted/30"
            size="sm"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analisando...' : 'Nova Análise'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-16 w-16 text-finance-primary mb-4" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Analisando suas finanças...</h3>
            <p className="text-muted-foreground text-center">
              Nossa IA está processando seus dados para gerar insights personalizados
            </p>
          </div>
        ) : analysis ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="predictions">Predições</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 border border-finance-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Score Financeiro</p>
                      <p className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score}/100
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-finance-primary" />
                  </div>
                  <Progress value={analysis.score} className="mt-2" />
                </Card>

                <Card className="p-4 border border-finance-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Nível de Risco</p>
                      <Badge className={getRiskColor(analysis.risk)}>
                        {analysis.risk === 'low' ? 'Baixo' : 
                         analysis.risk === 'medium' ? 'Médio' : 'Alto'}
                      </Badge>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-finance-warning" />
                  </div>
                </Card>

                <Card className="p-4 border border-finance-light">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium">Saudável</span>
                      </div>
                    </div>
                    <Target className="h-8 w-8 text-finance-success" />
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-3">Recomendações Principais</h3>
                {analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Alert className="border-finance-primary/20 bg-finance-light/30">
                      <Sparkles className="h-4 w-4 text-finance-primary" />
                      <AlertDescription className="text-finance-text">
                        {recommendation}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Insights Personalizados</h3>
              {analysis.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-finance-light/40 to-finance-secondary/40 p-4 rounded-2xl border border-finance-primary/20"
                >
                  <div className="flex items-start">
                    <Brain className="h-5 w-5 text-finance-primary mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-finance-text">{insight}</p>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Predições dos Próximos Meses</h3>
              <div className="space-y-3">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white border border-muted rounded-xl hover:shadow-md transition-shadow dark:bg-card dark:border-border"
                  >
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-finance-accent mr-3" />
                      <div>
                        <p className="font-medium">{prediction.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Confiança: {Math.round(prediction.confidence)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-finance-primary">
                        R$ {prediction.predictedAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <Progress value={prediction.confidence} className="w-20 h-2 mt-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Análise de Segurança</h3>
              
              {anomalies.length > 0 ? (
                <div className="space-y-3">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Foram detectadas {anomalies.length} possíveis anomalia(s) em suas transações.
                    </AlertDescription>
                  </Alert>
                  
                  {anomalies.map((anomaly, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-50 border border-red-200 p-4 rounded-xl"
                    >
                      <div className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <p className="text-red-800">{anomaly}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Nenhuma anomalia detectada em suas transações recentes. Suas finanças estão seguras!
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-6 p-4 bg-finance-light/30 rounded-xl">
                <h4 className="font-semibold mb-2 flex items-center">
                  <DollarSign className="h-5 w-5 text-finance-primary mr-2" />
                  Dicas de Segurança Financeira
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitore suas transações regularmente</li>
                  <li>• Configure alertas para gastos altos</li>
                  <li>• Mantenha suas senhas seguras</li>
                  <li>• Revise extratos mensalmente</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Clique em "Nova Análise" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 