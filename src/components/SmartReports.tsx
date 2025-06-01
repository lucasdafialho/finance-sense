import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar,
  TrendingUp,
  Loader2,
  Eye,
  Clock,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService, type FinancialData } from '@/services/geminiService';
import { useFinancialData } from '@/hooks/use-financial-data';

interface GeneratedReport {
  id: string;
  title: string;
  content: string;
  generatedAt: Date;
  type: 'monthly' | 'quarterly' | 'custom';
}

export const SmartReports: React.FC = () => {
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: financialData } = useFinancialData();

  const createReportData = (): FinancialData => ({
    transactions: financialData.transactions,
    goals: financialData.goals,
    expenses: financialData.categories,
    income: financialData.totalIncome,
    savings: financialData.currentSavings
  });

  const generateReport = async (type: 'monthly' | 'quarterly' | 'custom') => {
    if (financialData.transactions.length === 0) {
      const fallbackContent = `
        # Relatório Financeiro ${type === 'monthly' ? 'Mensal' : type === 'quarterly' ? 'Trimestral' : 'Personalizado'}
        
        ## Resumo
        Ainda não há dados suficientes para gerar um relatório detalhado.
        
        ## Próximos Passos
        - Registre suas transações diárias
        - Defina metas financeiras claras
        - Monitore seus gastos por categoria
        
        ## Dicas
        - Use linguagem natural para registrar gastos
        - Revise seus gastos semanalmente
        - Mantenha o foco em suas metas
      `;
      
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        title: `Relatório ${type === 'monthly' ? 'Mensal' : type === 'quarterly' ? 'Trimestral' : 'Personalizado'} - ${new Date().toLocaleDateString('pt-BR')}`,
        content: fallbackContent,
        generatedAt: new Date(),
        type
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
      return;
    }

    setIsGenerating(true);
    try {
      const reportData = createReportData();
      const content = await geminiService.generateFinancialReport(reportData);
      
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        title: `Relatório ${type === 'monthly' ? 'Mensal' : type === 'quarterly' ? 'Trimestral' : 'Personalizado'} - ${new Date().toLocaleDateString('pt-BR')}`,
        content,
        generatedAt: new Date(),
        type
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      
      // Fallback local
      const fallbackContent = generateLocalReport(type);
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        title: `Relatório ${type === 'monthly' ? 'Mensal' : type === 'quarterly' ? 'Trimestral' : 'Personalizado'} - ${new Date().toLocaleDateString('pt-BR')}`,
        content: fallbackContent,
        generatedAt: new Date(),
        type
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocalReport = (type: string): string => {
    const expenseRatio = financialData.totalIncome > 0 ? (financialData.totalExpenses / financialData.totalIncome * 100).toFixed(1) : '0';
    const topCategory = financialData.categories.length > 0 
      ? financialData.categories.reduce((max, cat) => cat.amount > max.amount ? cat : max)
      : null;
    
    return `
# Relatório Financeiro ${type === 'monthly' ? 'Mensal' : type === 'quarterly' ? 'Trimestral' : 'Personalizado'}

## Resumo Executivo
- Total de Transações: ${financialData.transactions.length}
- Receitas: R$ ${financialData.totalIncome.toLocaleString('pt-BR')}
- Despesas: R$ ${financialData.totalExpenses.toLocaleString('pt-BR')}
- Saldo: R$ ${(financialData.totalIncome - financialData.totalExpenses).toLocaleString('pt-BR')}
- Poupança Atual: R$ ${financialData.currentSavings.toLocaleString('pt-BR')}

## Análise de Gastos
- Percentual de Gastos: ${expenseRatio}% da renda
${topCategory ? `- Categoria Principal: ${topCategory.category} (R$ ${topCategory.amount.toLocaleString('pt-BR')})` : ''}

## Metas Financeiras
- Metas Ativas: ${financialData.goals.length}
${financialData.goals.map(goal => `- ${goal.title}: ${((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}% completo`).join('\n')}

## Recomendações
${expenseRatio > '80' ? '- Considere reduzir gastos para melhorar sua saúde financeira' : '- Parabéns! Seus gastos estão bem controlados'}
${financialData.goals.length === 0 ? '- Defina metas financeiras para manter o foco' : '- Continue trabalhando em direção às suas metas'}
- Mantenha o registro regular das transações

## Tendências
- Período analisado: ${new Date().toLocaleDateString('pt-BR')}
- Status: ${financialData.totalIncome >= financialData.totalExpenses ? 'Positivo' : 'Atenção necessária'}
    `;
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'monthly': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quarterly': return 'bg-green-100 text-green-800 border-green-200';
      case 'custom': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-muted dark:text-muted-foreground dark:border-border';
    }
  };

  const formatReportContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4 text-finance-text">{line.replace('# ', '')}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 text-finance-primary mt-6">{line.replace('## ', '')}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2 text-finance-accent mt-4">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.replace('- ', '')}</li>;
      } else if (line.includes('**')) {
        return <p key={index} className="font-semibold mb-2">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-2 text-muted-foreground">{line}</p>;
      }
    });
  };

  return (
    <Card className="rounded-3xl shadow-lg border-none overflow-hidden mb-6">
      <CardHeader className="bg-gradient-to-r from-finance-purple to-finance-accent p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-3" />
            <div>
              <CardTitle className="text-xl font-bold">Relatórios Inteligentes</CardTitle>
              <p className="text-white/80 text-sm">Análises detalhadas geradas por IA</p>
            </div>
          </div>
          <Badge className="bg-white/20 text-white dark:bg-muted/20">
            {reports.length} relatório{reports.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="generate">Gerar Relatório</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => generateReport('monthly')}
                disabled={isGenerating}
                className="h-24 flex-col bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none"
              >
                <Calendar className="h-6 w-6 mb-2" />
                <span className="font-semibold">Relatório Mensal</span>
                <span className="text-xs opacity-80">Análise do mês atual</span>
              </Button>

              <Button
                onClick={() => generateReport('quarterly')}
                disabled={isGenerating}
                className="h-24 flex-col bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none"
              >
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="font-semibold">Relatório Trimestral</span>
                <span className="text-xs opacity-80">Análise de 3 meses</span>
              </Button>

              <Button
                onClick={() => generateReport('custom')}
                disabled={isGenerating}
                className="h-24 flex-col bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-none"
              >
                <Star className="h-6 w-6 mb-2" />
                <span className="font-semibold">Relatório Personalizado</span>
                <span className="text-xs opacity-80">Análise completa</span>
              </Button>
            </div>

            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-finance-light/40 to-finance-secondary/40 p-6 rounded-2xl text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-finance-primary" />
                <h3 className="text-lg font-semibold mb-2">Gerando seu relatório...</h3>
                <p className="text-muted-foreground">
                  Nossa IA está analisando seus dados financeiros para criar um relatório detalhado e personalizado.
                </p>
              </motion.div>
            )}

            {selectedReport && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>

                <Card className="p-6 max-h-96 overflow-y-auto bg-white border border-muted dark:bg-card dark:border-border">
                  <div className="prose max-w-none">
                    {formatReportContent(selectedReport.content)}
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum relatório gerado ainda</h3>
                <p className="text-muted-foreground mb-4">
                  Gere seu primeiro relatório para começar a acompanhar suas análises financeiras.
                </p>
                <Button onClick={() => generateReport('monthly')}>
                  Gerar Primeiro Relatório
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white border border-muted rounded-xl hover:shadow-md transition-shadow cursor-pointer dark:bg-card dark:border-border dark:hover:bg-card/80"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-finance-primary mr-3" />
                      <div>
                        <h4 className="font-medium">{report.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {report.generatedAt.toLocaleString('pt-BR')}
                          </span>
                          <Badge variant="outline" className={getReportTypeColor(report.type)}>
                            {report.type === 'monthly' ? 'Mensal' : 
                             report.type === 'quarterly' ? 'Trimestral' : 'Personalizado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 