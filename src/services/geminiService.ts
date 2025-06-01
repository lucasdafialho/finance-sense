interface FinancialData {
  transactions: any[];
  goals: any[];
  expenses: any[];
  income: number;
  savings: number;
}

interface AIAnalysis {
  insights: string[];
  recommendations: string[];
  predictions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
}

interface InvestmentRecommendation {
  type: string;
  allocation: number;
  risk: string;
  expectedReturn: string;
  description: string;
}

class FinancialAIService {
  private apiKey: string;
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.isConfigured = !!this.apiKey;
  }

  private validateFinancialData(data: FinancialData): boolean {
    return data && 
           typeof data.income === 'number' && 
           typeof data.savings === 'number' &&
           Array.isArray(data.transactions) &&
           Array.isArray(data.goals) &&
           Array.isArray(data.expenses);
  }

  async analyzeFinancialData(data: FinancialData): Promise<AIAnalysis> {
    if (!this.validateFinancialData(data)) {
      return this.getFallbackAnalysis(data);
    }

    try {
      if (!this.isConfigured) {
        return this.getFallbackAnalysis(data);
      }

      const prompt = this.buildFinancialAnalysisPrompt(data);
      const response = await this.callAI(prompt);
      return this.parseFinancialAnalysis(response);
    } catch (error) {
      console.warn('Falha na análise com IA, usando análise local:', error);
      return this.getFallbackAnalysis(data);
    }
  }

  async detectAnomalies(transactions: any[]): Promise<string[]> {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return [];
    }

    try {
      if (!this.isConfigured) {
        return this.detectAnomaliesLocal(transactions);
      }

      const prompt = `
        Analise estas transações financeiras brasileiras e identifique possíveis anomalias.
        Considere: valores muito altos para o padrão, locais suspeitos, horários incomuns, 
        padrões irregulares ou gastos incompatíveis com o perfil.
        
        Transações: ${JSON.stringify(transactions.slice(0, 50))}
        
        Responda APENAS com um array JSON de strings em português descrevendo as anomalias.
        Se não houver anomalias, retorne [].
        Exemplo: ["Gasto de R$ 2.500 em horário atípico (3h da manhã)", "Compra duplicada no mesmo estabelecimento"]
      `;

      const response = await this.callAI(prompt);
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch (error) {
      console.warn('Falha na detecção de anomalias com IA, usando detecção local:', error);
      return this.detectAnomaliesLocal(transactions);
    }
  }

  async generateInvestmentRecommendations(
    profile: string, 
    amount: number, 
    timeHorizon: string
  ): Promise<InvestmentRecommendation[]> {
    if (!profile || !amount || amount <= 0) {
      return this.getFallbackInvestmentRecommendations();
    }

    try {
      if (!this.isConfigured) {
        return this.getLocalInvestmentRecommendations(profile, amount, timeHorizon);
      }

      const prompt = `
        Gere recomendações de investimento para o mercado brasileiro atual (2024).
        
        Perfil: ${profile}
        Valor: R$ ${amount.toLocaleString('pt-BR')}
        Prazo: ${timeHorizon}
        
        Considere:
        - Taxa Selic atual (~11.5%)
        - CDI (~10.9%)
        - Cenário econômico brasileiro
        - Diversificação de risco
        - Liquidez necessária
        
        Responda APENAS com um array JSON no formato:
        [{
          "type": "nome do investimento",
          "allocation": número de 0-100,
          "risk": "baixo|médio|alto",
          "expectedReturn": "X% a.a.",
          "description": "descrição em português"
        }]
        
        Garanta que a soma das alocações seja 100%.
      `;

      const response = await this.callAI(prompt);
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed.slice(0, 6) : this.getFallbackInvestmentRecommendations();
    } catch (error) {
      console.warn('Falha nas recomendações com IA, usando recomendações locais:', error);
      return this.getLocalInvestmentRecommendations(profile, amount, timeHorizon);
    }
  }

  async predictExpenses(historicalData: any[], months: number): Promise<any[]> {
    if (!Array.isArray(historicalData) || months <= 0 || months > 12) {
      return this.getFallbackPredictions(Math.min(months, 6));
    }

    try {
      if (!this.isConfigured) {
        return this.getLocalPredictions(historicalData, months);
      }

      const prompt = `
        Baseado nos dados históricos brasileiros, preveja gastos para ${months} meses.
        
        Dados: ${JSON.stringify(historicalData.slice(-12))}
        
        Considere:
        - Sazonalidade (Natal, férias, volta às aulas, Dia das Mães/Pais)
        - Inflação brasileira (~4-5% a.a.)
        - 13º salário em dezembro
        - Tendências econômicas
        
        Responda APENAS com array JSON:
        [{
          "month": "nome do mês em português",
          "predictedAmount": número,
          "confidence": número de 0-100,
          "factors": ["fator1", "fator2"]
        }]
      `;

      const response = await this.callAI(prompt);
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed.slice(0, months) : this.getFallbackPredictions(months);
    } catch (error) {
      console.warn('Falha na predição com IA, usando predição local:', error);
      return this.getLocalPredictions(historicalData, months);
    }
  }

  async generateFinancialReport(data: FinancialData): Promise<string> {
    if (!this.validateFinancialData(data)) {
      return this.getLocalFinancialReport(data);
    }

    try {
      if (!this.isConfigured) {
        return this.getLocalFinancialReport(data);
      }

      const prompt = `
        Gere um relatório financeiro personalizado em português brasileiro.
        
        Dados: ${JSON.stringify(data)}
        
        Estrutura do relatório:
        # 📊 Relatório Financeiro Personalizado
        
        ## 💰 Situação Atual
        [análise da renda, gastos e poupança]
        
        ## 📈 Análise por Categoria  
        [breakdown dos gastos principais]
        
        ## 🎯 Progresso das Metas
        [avaliação das metas financeiras]
        
        ## ⚠️ Pontos de Atenção
        [alertas e cuidados necessários]
        
        ## 💡 Recomendações
        [sugestões específicas e acionáveis]
        
        ## 🚀 Próximos Passos
        [ações concretas para os próximos 30 dias]
        
        Use tom amigável, dados em reais (R$) e percentuais claros.
      `;

      const response = await this.callAI(prompt);
      return response || this.getLocalFinancialReport(data);
    } catch (error) {
      console.warn('Falha na geração do relatório com IA, usando relatório local:', error);
      return this.getLocalFinancialReport(data);
    }
  }

  async chatWithAI(message: string, context: FinancialData): Promise<string> {
    if (!message?.trim()) {
      return 'Por favor, faça uma pergunta sobre suas finanças.';
    }

    try {
      if (!this.isConfigured) {
        return this.getLocalChatResponse(message, context);
      }

      const prompt = `
        Você é um consultor financeiro especializado no mercado brasileiro.
        
        Contexto financeiro: ${JSON.stringify(context)}
        Pergunta: ${message}
        
        Responda de forma:
        - Clara e objetiva em português
        - Personalizada para o contexto do usuário
        - Com sugestões práticas quando aplicável
        - Usando valores em reais (R$)
        - Tom amigável e profissional
        
        Máximo 200 palavras.
      `;

      const response = await this.callAI(prompt);
      return response || this.getLocalChatResponse(message, context);
    } catch (error) {
      console.warn('Falha no chat com IA, usando resposta local:', error);
      return this.getLocalChatResponse(message, context);
    }
  }

  private async callAI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API Key não configurada');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Resposta inválida da API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  private buildFinancialAnalysisPrompt(data: FinancialData): string {
    return `
      Analise os dados financeiros a seguir e forneça insights valiosos:
      
      Receita mensal: R$ ${data.income}
      Poupança atual: R$ ${data.savings}
      Gastos por categoria: ${JSON.stringify(data.expenses)}
      Metas financeiras: ${JSON.stringify(data.goals)}
      Transações recentes: ${JSON.stringify(data.transactions)}
      
      Forneça uma análise estruturada incluindo:
      1. Insights principais sobre o comportamento financeiro
      2. Recomendações específicas de melhoria
      3. Predições para os próximos meses
      4. Nível de risco financeiro atual
      5. Score financeiro de 0-100
      
      Responda APENAS com um JSON válido no formato:
      {
        "insights": ["insight1", "insight2"],
        "recommendations": ["rec1", "rec2"],
        "predictions": ["pred1", "pred2"],
        "riskLevel": "low|medium|high",
        "score": número de 0-100
      }
    `;
  }

  private parseFinancialAnalysis(response: string): AIAnalysis {
    try {
      return JSON.parse(response);
    } catch (error) {
      return {
        insights: ['Análise personalizada não disponível no momento'],
        recommendations: ['Mantenha o controle de seus gastos'],
        predictions: ['Continue acompanhando suas finanças regularmente'],
        riskLevel: 'medium',
        score: 70
      };
    }
  }

  private getFallbackAnalysis(data: FinancialData): AIAnalysis {
    const expenseTotal = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = (data.savings / data.income) * 100;
    
    return {
      insights: [
        `Sua taxa de poupança atual é de ${savingsRate.toFixed(1)}%`,
        `Seus gastos totais representam ${((expenseTotal / data.income) * 100).toFixed(1)}% da renda`
      ],
      recommendations: [
        savingsRate < 20 ? 'Tente aumentar sua taxa de poupança para pelo menos 20%' : 'Parabéns pela boa taxa de poupança!',
        'Revise seus gastos recorrentes mensalmente'
      ],
      predictions: [
        'Mantendo o padrão atual, você atingirá suas metas em tempo hábil',
        'Considere investir parte da reserva em opções de maior rentabilidade'
      ],
      riskLevel: savingsRate < 10 ? 'high' : savingsRate < 20 ? 'medium' : 'low',
      score: Math.min(Math.round(savingsRate * 2 + 40), 100)
    };
  }

  private getFallbackInvestmentRecommendations(): InvestmentRecommendation[] {
    return [
      {
        type: 'Tesouro Selic',
        allocation: 40,
        risk: 'baixo',
        expectedReturn: '11-13% a.a.',
        description: 'Liquidez diária e baixo risco'
      },
      {
        type: 'CDB/LCI',
        allocation: 30,
        risk: 'baixo',
        expectedReturn: '12-14% a.a.',
        description: 'Proteção do FGC até R$ 250mil'
      },
      {
        type: 'Fundos Multimercado',
        allocation: 20,
        risk: 'médio',
        expectedReturn: '14-18% a.a.',
        description: 'Diversificação profissional'
      },
      {
        type: 'Ações/ETFs',
        allocation: 10,
        risk: 'alto',
        expectedReturn: '15-25% a.a.',
        description: 'Potencial de maior retorno no longo prazo'
      }
    ];
  }

  private getFallbackPredictions(months: number): any[] {
    const predictions = [];
    const baseAmount = 2500;
    
    for (let i = 1; i <= months; i++) {
      const monthName = new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000)
        .toLocaleString('pt-BR', { month: 'long' });
      
      predictions.push({
        month: monthName,
        predictedAmount: baseAmount + (Math.random() * 500 - 250),
        confidence: 75 + Math.random() * 20,
        factors: ['padrão histórico', 'sazonalidade']
      });
    }
    
    return predictions;
  }

  private getLocalFinancialReport(data: FinancialData): string {
    const expenseTotal = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = data.income > 0 ? (data.savings / data.income) * 100 : 0;
    const expenseRate = data.income > 0 ? (expenseTotal / data.income) * 100 : 0;
    
    return `# 📊 Relatório Financeiro Personalizado

## 💰 Situação Atual
Sua renda mensal é de **R$ ${data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** e você possui **R$ ${data.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** em poupança.

Sua taxa de poupança atual é de **${savingsRate.toFixed(1)}%**, ${savingsRate >= 20 ? 'que está excelente! Parabéns pelo controle financeiro.' : savingsRate >= 10 ? 'que está dentro do aceitável, mas pode melhorar.' : 'que precisa de atenção urgente.'}

## 📈 Análise por Categoria
Seus gastos representam **${expenseRate.toFixed(1)}%** da sua renda total.

${data.expenses.length > 0 ? data.expenses.map(exp => 
  `- **${exp.category}**: R$ ${exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${((exp.amount / expenseTotal) * 100).toFixed(1)}%)`
).join('\n') : 'Nenhuma categoria de gasto registrada.'}

## 🎯 Progresso das Metas
${data.goals.length > 0 ? 
  `Você tem ${data.goals.length} meta(s) financeira(s) ativa(s). Continue focado nos seus objetivos!` : 
  'Considere definir metas financeiras claras para melhor controle.'}

## ⚠️ Pontos de Atenção
${savingsRate < 10 ? '- **Crítico**: Taxa de poupança muito baixa\n' : ''}
${expenseRate > 90 ? '- **Atenção**: Gastos muito altos em relação à renda\n' : ''}
- Monitore gastos recorrentes mensalmente
- Mantenha uma reserva de emergência

## 💡 Recomendações
- ${savingsRate < 20 ? 'Tente aumentar sua taxa de poupança para pelo menos 20%' : 'Mantenha sua excelente disciplina de poupança'}
- Revise e otimize suas categorias de gasto mensalmente
- Consider investir parte da reserva em opções de maior rentabilidade

## 🚀 Próximos Passos
1. **Esta semana**: Revise todos os gastos do mês passado
2. **Próximos 15 dias**: ${savingsRate < 15 ? 'Identifique 3 gastos desnecessários para cortar' : 'Pesquise opções de investimento para sua reserva'}
3. **Próximo mês**: Implemente um sistema de controle mais rigoroso`;
  }

  private getLocalChatResponse(message: string, context: FinancialData): string {
    const lowerMessage = message.toLowerCase();
    const expenseTotal = context.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = context.income > 0 ? (context.savings / context.income) * 100 : 0;

    if (lowerMessage.includes('gast') || lowerMessage.includes('despesa')) {
      return `Analisando seus gastos, o total mensal é de R$ ${expenseTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, representando ${((expenseTotal / context.income) * 100).toFixed(1)}% da sua renda. ${expenseTotal / context.income > 0.8 ? 'Isso está um pouco alto - considere revisar algumas categorias.' : 'Está dentro de um nível controlável.'} Gostaria que eu detalhe alguma categoria específica?`;
    }
    
    if (lowerMessage.includes('economi') || lowerMessage.includes('poupar') || lowerMessage.includes('guardar')) {
      const suggestion = savingsRate < 10 ? 'Recomendo começar poupando pelo menos 10% da renda' : 
                       savingsRate < 20 ? 'Tente aumentar gradualmente para 20% da renda' :
                       'Parabéns! Sua taxa de poupança está excelente';
      return `Sua taxa de poupança atual é ${savingsRate.toFixed(1)}%. ${suggestion}. Uma dica prática: automatize transferências para a poupança logo que receber o salário. Posso sugerir estratégias específicas baseadas no seu perfil.`;
    }
    
    if (lowerMessage.includes('invest') || lowerMessage.includes('aplicar') || lowerMessage.includes('render')) {
      return `Com R$ ${context.savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponíveis, recomendo: 50% em Tesouro Selic (liquidez diária), 30% em CDB/LCI (proteção FGC), 20% em fundos conservadores. Isso pode render aproximadamente 11-13% ao ano. Quer que eu detalhe alguma opção específica?`;
    }
    
    if (lowerMessage.includes('meta') || lowerMessage.includes('objetivo') || lowerMessage.includes('planej')) {
      return `${context.goals.length > 0 ? `Você tem ${context.goals.length} meta(s) definida(s).` : 'Ainda não identifiquei metas específicas.'} Para um bom planejamento financeiro, recomendo metas SMART: específicas, mensuráveis e com prazo. Com sua atual capacidade de poupança, você pode alcançar objetivos interessantes. Que tipo de meta gostaria de estabelecer?`;
    }
    
    return `Obrigado pela pergunta! Com base no seu perfil financeiro (renda de R$ ${context.income.toLocaleString('pt-BR')}, poupança de ${savingsRate.toFixed(1)}%), posso te ajudar com estratégias personalizadas. Suas finanças estão ${savingsRate > 15 ? 'em bom caminho' : 'precisando de ajustes'}. Gostaria de focar em algum aspecto específico como gastos, investimentos ou planejamento?`;
  }

  private getLocalInvestmentRecommendations(profile: string, amount: number, timeHorizon: string): InvestmentRecommendation[] {
    const isConservative = profile.toLowerCase().includes('conservador') || profile.toLowerCase().includes('baixo');
    const isAggressive = profile.toLowerCase().includes('agressivo') || profile.toLowerCase().includes('alto');
    const isLongTerm = timeHorizon.includes('ano') || timeHorizon.includes('longo');

    if (isConservative) {
      return [
        {
          type: 'Tesouro Selic',
          allocation: 50,
          risk: 'baixo',
          expectedReturn: '11-12% a.a.',
          description: 'Liquidez diária, acompanha a taxa básica de juros'
        },
        {
          type: 'CDB/LCI/LCA',
          allocation: 35,
          risk: 'baixo',
          expectedReturn: '110-120% CDI',
          description: 'Proteção do FGC até R$ 250 mil por instituição'
        },
        {
          type: 'Fundos DI',
          allocation: 15,
          risk: 'baixo',
          expectedReturn: '95-105% CDI',
          description: 'Gestão profissional, baixa volatilidade'
        }
      ];
    }

    if (isAggressive && isLongTerm) {
      return [
        {
          type: 'Ações/ETFs',
          allocation: 40,
          risk: 'alto',
          expectedReturn: '15-25% a.a.',
          description: 'Potencial de maior retorno no longo prazo'
        },
        {
          type: 'Fundos Multimercado',
          allocation: 30,
          risk: 'médio',
          expectedReturn: '12-18% a.a.',
          description: 'Diversificação profissional em várias classes'
        },
        {
          type: 'Tesouro IPCA+',
          allocation: 20,
          risk: 'médio',
          expectedReturn: 'IPCA + 5-6% a.a.',
          description: 'Proteção contra inflação de longo prazo'
        },
        {
          type: 'Reserva de Emergência',
          allocation: 10,
          risk: 'baixo',
          expectedReturn: '11-12% a.a.',
          description: 'Tesouro Selic para liquidez imediata'
        }
      ];
    }

    return [
      {
        type: 'Tesouro Selic',
        allocation: 40,
        risk: 'baixo',
        expectedReturn: '11-13% a.a.',
        description: 'Base da carteira, liquidez diária'
      },
      {
        type: 'CDB/LCI',
        allocation: 30,
        risk: 'baixo',
        expectedReturn: '12-14% a.a.',
        description: 'Proteção do FGC, boa rentabilidade'
      },
      {
        type: 'Fundos Multimercado',
        allocation: 20,
        risk: 'médio',
        expectedReturn: '13-17% a.a.',
        description: 'Diversificação e gestão profissional'
      },
      {
        type: 'Fundos Imobiliários',
        allocation: 10,
        risk: 'médio',
        expectedReturn: '8-12% a.a. + dividendos',
        description: 'Exposição ao mercado imobiliário'
      }
    ];
  }

  private getLocalPredictions(historicalData: any[], months: number): any[] {
    const predictions = [];
    const baseAmount = historicalData.length > 0 ? 
      historicalData.reduce((sum, item) => sum + (item.amount || 0), 0) / historicalData.length : 2500;
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    for (let i = 1; i <= months; i++) {
      const currentMonth = new Date();
      currentMonth.setMonth(currentMonth.getMonth() + i);
      const monthName = monthNames[currentMonth.getMonth()];
      
      let seasonalFactor = 1.0;
      let factors = ['padrão histórico'];
      
      if (monthName === 'Dezembro') {
        seasonalFactor = 1.3;
        factors = ['Natal e festas', '13º salário', 'gastos sazonais'];
      } else if (monthName === 'Janeiro' || monthName === 'Fevereiro') {
        seasonalFactor = 1.15;
        factors = ['volta das férias', 'ajustes pós-festas'];
      } else if (monthName === 'Março') {
        seasonalFactor = 1.1;
        factors = ['volta às aulas', 'gastos escolares'];
      } else if (monthName === 'Maio') {
        seasonalFactor = 1.05;
        factors = ['Dia das Mães', 'presentes'];
      } else if (monthName === 'Agosto') {
        seasonalFactor = 1.05;
        factors = ['Dia dos Pais', 'presentes'];
      } else if (monthName === 'Julho') {
        seasonalFactor = 1.1;
        factors = ['férias escolares', 'viagens'];
      }
      
      const inflationFactor = 1 + (0.04 / 12);
      const predictedAmount = baseAmount * seasonalFactor * inflationFactor;
      
      predictions.push({
        month: monthName,
        predictedAmount: Math.round(predictedAmount),
        confidence: Math.min(95 - (i * 5), 70),
        factors
      });
    }
    
    return predictions;
  }

  private detectAnomaliesLocal(transactions: any[]): string[] {
    const anomalies: string[] = [];
    
    if (transactions.length === 0) return anomalies;
    
    const amounts = transactions.map(t => t.amount || 0);
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const maxAmount = Math.max(...amounts);
    
    if (maxAmount > avgAmount * 3) {
      anomalies.push(`Transação de R$ ${maxAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} muito acima da média (R$ ${avgAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`);
    }
    
    const duplicates = transactions.filter((t1, index) => 
      transactions.findIndex(t2 => 
        t2.amount === t1.amount && 
        t2.description === t1.description && 
        Math.abs(new Date(t2.date).getTime() - new Date(t1.date).getTime()) < 86400000
      ) !== index
    );
    
    if (duplicates.length > 0) {
      anomalies.push(`${duplicates.length} transação(ões) duplicada(s) detectada(s) no mesmo dia`);
    }
    
    const nightTransactions = transactions.filter(t => {
      const hour = new Date(t.date).getHours();
      return hour >= 0 && hour <= 5 && t.amount > avgAmount;
    });
    
    if (nightTransactions.length > 0) {
      anomalies.push(`${nightTransactions.length} transação(ões) em horário noturno (00h-05h) com valores elevados`);
    }
    
    return anomalies.slice(0, 5);
  }
}

export const geminiService = new FinancialAIService();
export type { FinancialData, AIAnalysis, InvestmentRecommendation }; 