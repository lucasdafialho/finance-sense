import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Sparkles, Loader2, ChevronDown, SendHorizontal, Brain, BarChart3, Target, TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useFinancialData } from '@/hooks/use-financial-data';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
  hasActions?: boolean;
  actions?: ChatAction[];
  type?: 'text' | 'analysis' | 'suggestion' | 'action';
}

interface ChatAction {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: financialData, addTransactionFromInput, addGoal } = useFinancialData();
  const { toast } = useToast();
  
  // Inicializar com mensagem de boas-vindas
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        id: '1',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  }, [financialData]);

  const getWelcomeMessage = () => {
    const hasData = financialData.transactions.length > 0;
    const totalTransactions = financialData.transactions.length;
    const totalGoals = financialData.goals.length;
    
    if (hasData) {
      return `Olá! 👋 Sou seu assistente financeiro inteligente.\n\n📊 Seu resumo:\n• ${totalTransactions} transações registradas\n• ${totalGoals} metas ativas\n• Saldo atual: R$ ${(financialData.totalIncome - financialData.totalExpenses).toLocaleString('pt-BR')}\n\nComo posso te ajudar com suas finanças hoje? Posso analisar gastos, sugerir economias ou te ajudar com planejamento!`;
    }
    
    return `Olá! 👋 Sou seu assistente financeiro inteligente.\n\n🚀 Posso te ajudar com:\n• Análise detalhada de gastos\n• Estratégias de economia personalizadas\n• Planejamento de metas financeiras\n• Dicas de investimento\n• Controle de dívidas\n\n💡 Dica: Registre algumas transações primeiro para análises mais precisas!`;
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, isUser: boolean, options: Partial<Message> = {}): string => {
    const messageId = `msg-${Date.now()}-${Math.random()}`;
    const newMessage: Message = {
      id: messageId,
      text,
      isUser,
      timestamp: new Date(),
      type: 'text',
      ...options
    };
    setMessages(prev => [...prev, newMessage]);
    return messageId;
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    addMessage(text, true);
    setInput("");
    setIsTyping(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const response = await getIntelligentResponse(text);
      addMessage(response.text, false, response.options);
      
    } catch (error) {
      console.error('Erro no chat:', error);
      addMessage("😅 Ops! Tive uma dificuldade técnica, mas estou aqui para te ajudar. Tente reformular sua pergunta ou me pergunte sobre dicas financeiras gerais!", false, { isError: true });
    } finally {
      setIsTyping(false);
    }
  };

  const getIntelligentResponse = async (message: string): Promise<{text: string, options?: Partial<Message>}> => {
    const lowerMessage = message.toLowerCase();
    const hasData = financialData.transactions.length > 0;
    
    // Comandos especiais
    if (lowerMessage.startsWith('/')) {
      return handleCommand(lowerMessage);
    }
    
    // Análise de gastos detalhada
    if (lowerMessage.includes('analise') || lowerMessage.includes('análise') || lowerMessage.includes('como estou') || lowerMessage.includes('situação financeira')) {
      return getFinancialAnalysis();
    }
    
    // Registro de transação via chat
    if (lowerMessage.includes('registr') && (lowerMessage.includes('gast') || lowerMessage.includes('comprei') || lowerMessage.includes('recebi'))) {
      return handleTransactionRegistration(message);
    }
    
    // Criação de meta via chat
    if (lowerMessage.includes('meta') && (lowerMessage.includes('criar') || lowerMessage.includes('definir') || lowerMessage.includes('objetivo'))) {
      return handleGoalCreation();
    }
    
    // Sugestões personalizadas de economia
    if (lowerMessage.includes('economi') || lowerMessage.includes('como economizar') || lowerMessage.includes('poupar')) {
      return getPersonalizedSavingTips();
    }
    
    // Análise de categoria específica
    if (lowerMessage.includes('alimentação') || lowerMessage.includes('mercado') || lowerMessage.includes('comida')) {
      return getCategoryAnalysis('Alimentação');
    }
    
    if (lowerMessage.includes('transporte') || lowerMessage.includes('uber') || lowerMessage.includes('gasolina')) {
      return getCategoryAnalysis('Transporte');
    }
    
    // Investimentos contextuais
    if (lowerMessage.includes('invest') || lowerMessage.includes('aplicar dinheiro') || lowerMessage.includes('onde investir')) {
      return getInvestmentAdvice();
    }
    
    // Planejamento financeiro
    if (lowerMessage.includes('planej') || lowerMessage.includes('organizar') || lowerMessage.includes('como melhorar')) {
      return getFinancialPlanning();
    }
    
    // Saudações inteligentes
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('alo')) {
      const greeting = hasData 
        ? `Oi! 👋 Vi que você tem ${financialData.transactions.length} transações registradas. Quer que eu faça uma análise rápida ou tem alguma pergunta específica?`
        : `Olá! 👋 Vou te ajudar a organizar suas finanças. Comece registrando algumas transações ou me pergunte sobre estratégias financeiras!`;
      
      return { 
        text: greeting,
        options: {
          hasActions: true,
          actions: hasData ? [
            { label: "📊 Análise Completa", action: () => sendMessage("Faça uma análise completa"), icon: <BarChart3 className="h-4 w-4" /> },
            { label: "💡 Dicas de Economia", action: () => sendMessage("Como posso economizar?"), icon: <PiggyBank className="h-4 w-4" /> },
            { label: "🎯 Criar Meta", action: () => sendMessage("Quero criar uma meta"), icon: <Target className="h-4 w-4" /> }
          ] : [
            { label: "📝 Como Registrar", action: () => sendMessage("Como registrar transações?"), icon: <DollarSign className="h-4 w-4" /> },
            { label: "💡 Dicas Gerais", action: () => sendMessage("Dicas de finanças"), icon: <Brain className="h-4 w-4" /> }
          ]
        }
      };
    }
    
    // Resposta padrão contextual
    return getContextualResponse(message);
  };

  const handleCommand = (command: string): Promise<{text: string, options?: Partial<Message>}> => {
    const cmd = command.toLowerCase();
    
    switch (cmd) {
      case '/analise':
        return getFinancialAnalysis();
      case '/ajuda':
        return Promise.resolve({
          text: `🤖 Comandos Disponíveis:\n\n📊 /analise - Análise completa das finanças\n💡 /dicas - Sugestões personalizadas\n🎯 /metas - Visualizar metas\n📈 /investir - Dicas de investimento\n💳 /dividas - Estratégias para dívidas\n\nExemplos de perguntas:\n• "Como estou financeiramente?"\n• "Registrar gasto de R$50 mercado"\n• "Quero criar uma meta de viagem"\n• "Como economizar na alimentação?"`,
          options: { type: 'suggestion' }
        });
      case '/limpar':
        clearChat();
        return Promise.resolve({ text: "🧹 Chat limpo! Como posso te ajudar?" });
      default:
        return Promise.resolve({ text: "🤔 Comando não reconhecido. Digite /ajuda para ver comandos disponíveis." });
    }
  };

  const getFinancialAnalysis = (): Promise<{text: string, options?: Partial<Message>}> => {
    const { transactions, categories, goals, totalIncome, totalExpenses, currentSavings } = financialData;
    
    if (transactions.length === 0) {
      return Promise.resolve({
        text: "📊 Análise Financeira\n\n⚠️ Ainda não há dados suficientes para uma análise detalhada.\n\n💡 Para começar:\n• Registre suas transações usando linguagem natural\n• Defina suas metas financeiras\n• Acompanhe por pelo menos uma semana\n\nAssim posso gerar insights personalizados para você! 🚀",
        options: {
          hasActions: true,
          actions: [
            { label: "📝 Como Registrar", action: () => sendMessage("Como registrar transações?") },
            { label: "🎯 Criar Meta", action: () => sendMessage("Criar meta") }
          ]
        }
      });
    }
    
    const balance = totalIncome - totalExpenses;
    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome * 100).toFixed(1) : '0';
    const topCategory = categories.length > 0 ? categories.reduce((max, cat) => cat.amount > max.amount ? cat : max) : null;
    
    // Score financeiro simples
    let score = 100;
    if (parseFloat(expenseRatio) > 80) score -= 30;
    else if (parseFloat(expenseRatio) > 60) score -= 15;
    if (balance < 0) score -= 25;
    if (goals.length === 0) score -= 10;
    score = Math.max(0, score);
    
    const analysis = `📊 Análise Financeira Completa\n\n💎 Score Financeiro: ${score}/100 ${score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴'}\n\n💰 Resumo:\n• Receitas: R$ ${totalIncome.toLocaleString('pt-BR')}\n• Despesas: R$ ${totalExpenses.toLocaleString('pt-BR')}\n• Saldo: R$ ${balance.toLocaleString('pt-BR')} ${balance >= 0 ? '✅' : '⚠️'}\n• Poupança: R$ ${currentSavings.toLocaleString('pt-BR')}\n\n📈 Indicadores:\n• % de gastos: ${expenseRatio}% da renda ${parseFloat(expenseRatio) <= 70 ? '✅' : '⚠️'}\n• Transações: ${transactions.length}\n• Metas ativas: ${goals.length}\n\n${topCategory ? `🏆 Maior gasto: ${topCategory.category} (R$ ${topCategory.amount.toLocaleString('pt-BR')})\n\n` : ''}💡 Recomendação: ${getSmartRecommendation(score, parseFloat(expenseRatio), balance)}`;
    
    return Promise.resolve({
      text: analysis,
      options: {
        type: 'analysis',
        hasActions: true,
        actions: [
          { label: "💡 Dicas Personalizadas", action: () => sendMessage("Dicas de economia"), icon: <PiggyBank className="h-4 w-4" /> },
          { label: "📈 Análise por Categoria", action: () => sendMessage("Analisar categoria " + (topCategory?.category || 'alimentação')), icon: <BarChart3 className="h-4 w-4" /> },
          { label: "🎯 Criar Nova Meta", action: () => sendMessage("Criar meta"), icon: <Target className="h-4 w-4" /> }
        ]
      }
    });
  };

  const getSmartRecommendation = (score: number, expenseRatio: number, balance: number): string => {
    if (score >= 80) return "Parabéns! Suas finanças estão muito bem organizadas. Continue assim! 🎉";
    if (score >= 60) return "Boa gestão financeira! Pequenos ajustes podem melhorar ainda mais.";
    if (expenseRatio > 80) return "Priorize reduzir gastos. Foque na maior categoria de despesas.";
    if (balance < 0) return "Urgente: equilibre receitas e despesas. Considere renda extra.";
    return "Comece definindo metas claras e controlando gastos desnecessários.";
  };

  const getPersonalizedSavingTips = (): Promise<{text: string, options?: Partial<Message>}> => {
    const { categories, totalExpenses } = financialData;
    
    if (categories.length === 0) {
      return Promise.resolve({
        text: "💡 Dicas Universais de Economia:\n\n🏆 Top 5 Estratégias:\n\n1. 🤖 Automatize a poupança (20% da renda)\n2. 📝 Regra 24h para compras não essenciais\n3. 🍽️ Cozinhe mais em casa (economia de 60%)\n4. 📱 Apps de cashback em compras\n5. 🔍 Renegocie contratos anuais\n\n💰 Meta: Economizar pelo menos 20% da renda mensalmente!"
      });
    }
    
    const topCategories = categories.sort((a, b) => b.amount - a.amount).slice(0, 3);
    const totalCategorySpending = categories.reduce((sum, cat) => sum + cat.amount, 0);
    
    let tips = "💡 Dicas Personalizadas de Economia:\n\n";
    
    topCategories.forEach((cat, index) => {
      const percentage = ((cat.amount / totalCategorySpending) * 100).toFixed(0);
      tips += `${index + 1}. 📊 ${cat.category} (${percentage}% dos gastos - R$ ${cat.amount.toLocaleString('pt-BR')})\n`;
      tips += getSpecificCategoryTip(cat.category) + "\n\n";
    });
    
    const potentialSavings = totalExpenses * 0.15;
    tips += `🎯 Potencial de economia: R$ ${potentialSavings.toLocaleString('pt-BR')}/mês\n\n💡 Próximo passo: Foque na categoria com maior gasto!`;
    
    return Promise.resolve({
      text: tips,
      options: {
        type: 'suggestion',
        hasActions: true,
        actions: topCategories.slice(0, 2).map(cat => ({
          label: `Economizar em ${cat.category}`,
          action: () => sendMessage(`Como economizar em ${cat.category.toLowerCase()}?`)
        }))
      }
    });
  };

  const getSpecificCategoryTip = (category: string): string => {
    const tips = {
      'Alimentação': "🍽️ Planeje refeições, compre com lista, prefira cozinhar em casa",
      'Transporte': "🚗 Use transporte público, caronas ou trabalho remoto quando possível", 
      'Moradia': "🏠 Renegocie energia/água, considere dividir custos",
      'Entretenimento': "🎬 Aproveite eventos gratuitos, streaming familiar, happy hours",
      'Saúde': "💊 Compare preços de medicamentos, use genéricos",
      'Compras': "🛍️ Use listas, compare preços, evite compras por impulso",
      'Outros': "💰 Revise gastos recorrentes e cancele serviços não utilizados"
    };
    return tips[category] || "💡 Monitore estes gastos de perto e questione se são realmente necessários";
  };

  const getCategoryAnalysis = (category: string): Promise<{text: string, options?: Partial<Message>}> => {
    const categoryData = financialData.categories.find(cat => cat.category === category);
    
    if (!categoryData) {
      return Promise.resolve({
        text: `📊 Análise: ${category}\n\n📝 Você ainda não tem gastos registrados nesta categoria.\n\n💡 Dicas gerais para ${category.toLowerCase()}:\n${getSpecificCategoryTip(category)}\n\nRegistre algumas transações para análises mais precisas!`
      });
    }
    
    const percentage = financialData.totalExpenses > 0 ? 
      ((categoryData.amount / financialData.totalExpenses) * 100).toFixed(1) : '0';
    
    const idealPercentages = {
      'Alimentação': '15-20%',
      'Moradia': '25-30%',
      'Transporte': '10-15%',
      'Entretenimento': '5-10%',
      'Saúde': '5-10%',
      'Compras': '5-10%'
    };
    
    const ideal = idealPercentages[category] || '10-15%';
    const isHigh = parseFloat(percentage) > parseFloat(ideal.split('-')[1]?.replace('%', '') || '15');
    
    const analysis = `📊 Análise Detalhada: ${category}\n\n💰 Seus gastos:\n• Valor: R$ ${categoryData.amount.toLocaleString('pt-BR')}\n• Percentual: ${percentage}% do total\n• Ideal: ${ideal} da renda\n\n${isHigh ? '⚠️ Acima do ideal!' : '✅ Dentro do ideal'}\n\n💡 Dica específica:\n${getSpecificCategoryTip(category)}\n\n📈 Sugestão: ${isHigh ? `Tente reduzir 20% nesta categoria` : `Continue controlando bem estes gastos`}`;
    
    return Promise.resolve({
      text: analysis,
      options: {
        hasActions: true,
        actions: isHigh ? [
          { label: `💡 Como Economizar em ${category}`, action: () => sendMessage(`Como economizar em ${category.toLowerCase()}?`) }
        ] : []
      }
    });
  };

  const getInvestmentAdvice = (): Promise<{text: string, options?: Partial<Message>}> => {
    const { currentSavings, totalIncome, totalExpenses } = financialData;
    const monthlyBalance = totalIncome - totalExpenses;
    const hasEmergencyFund = currentSavings >= (totalExpenses * 6);
    
    let advice = "💰 Consultoria de Investimentos Personalizada\n\n";
    
    if (monthlyBalance <= 0) {
      advice += "⚠️ Prioridade: Primeiro equilibre receitas e despesas.\n\n📌 Passos:\n1. Reduza gastos desnecessários\n2. Busque renda extra\n3. Só invista após ter sobra mensal\n\n💡 Lembre-se: Não invista dinheiro que você precisa!";
    } else if (!hasEmergencyFund) {
      advice += `🚨 Reserva de Emergência em foco!\n\n💾 Situação atual: R$ ${currentSavings.toLocaleString('pt-BR')}\n🎯 Meta ideal: R$ ${(totalExpenses * 6).toLocaleString('pt-BR')} (6 meses de gastos)\n\n📈 Estratégia:\n1. Tesouro Selic (liquidez diária)\n2. CDB com liquidez diária\n3. Poupança (último caso)\n\n⏰ Tempo estimado: ${Math.ceil((totalExpenses * 6 - currentSavings) / monthlyBalance)} meses`;
    } else {
      advice += `🎯 Pronto para investir!\n\n✅ Reserva OK: R$ ${currentSavings.toLocaleString('pt-BR')}\n💰 Sobra mensal: R$ ${monthlyBalance.toLocaleString('pt-BR')}\n\n🏆 Carteira Sugerida:\n\n🔒 60% Renda Fixa:\n• Tesouro Selic\n• CDB de bancos digitais\n• LCI/LCA\n\n📈 30% Variável:\n• Fundos multimercado\n• ETFs (IVVB11, BOVA11)\n\n🚀 10% Crescimento:\n• Ações individuais\n• REITs (Fundos Imobiliários)\n\n💡 Comece com R$ 100/mês e aumente gradualmente!`;
    }
    
    return Promise.resolve({
      text: advice,
      options: {
        hasActions: true,
        actions: [
          { label: "🎯 Criar Meta de Investimento", action: () => sendMessage("Criar meta para investimentos") },
          { label: "📚 Mais sobre Reserva", action: () => sendMessage("Como fazer reserva de emergência?") }
        ]
      }
    });
  };

  const getFinancialPlanning = (): Promise<{text: string, options?: Partial<Message>}> => {
    return Promise.resolve({
      text: "📋 Planejamento Financeiro Personalizado\n\n🎯 Metodologia 50-30-20:\n• 50% Necessidades (moradia, alimentação, transporte)\n• 30% Desejos (lazer, compras não essenciais)\n• 20% Poupança e investimentos\n\n📊 Passos para organizar:\n\n1. 📝 Mapeie todas as receitas e despesas\n2. 🎯 Defina metas claras (curto, médio, longo prazo)\n3. 🚨 Construa reserva de emergência primeiro\n4. 📈 Invista o excedente conforme seu perfil\n5. 📱 Monitore mensalmente e ajuste\n\n💡 Dica: Comece pequeno, seja consistente!"
    });
  };

  const handleTransactionRegistration = (message: string): Promise<{text: string, options?: Partial<Message>}> => {
    const amountMatch = message.match(/r?\$?\s*(\d+(?:[.,]\d{1,2})?)/i);
    
    if (amountMatch) {
      const success = addTransactionFromInput(message);
      if (success) {
        return Promise.resolve({
          text: "✅ Transação registrada com sucesso!\n\nRegistrei sua transação nos dados. Quer que eu faça uma análise atualizada dos seus gastos?",
          options: {
            hasActions: true,
            actions: [
              { label: "📊 Ver Análise Atualizada", action: () => sendMessage("Análise completa") },
              { label: "➕ Registrar Outra", action: () => sendMessage("Quero registrar outra transação") }
            ]
          }
        });
      }
    }
    
    return Promise.resolve({
      text: "📝 Como registrar transações:\n\nUse linguagem natural no campo de entrada acima! 👆\n\n✅ Exemplos que funcionam:\n• \"Gastei R$80 no mercado hoje\"\n• \"Recebi R$1500 de salário\"\n• \"Paguei R$25 de Uber\"\n• \"Comprei R$120 de roupas\"\n\n🤖 Eu categorizo automaticamente para você!"
    });
  };

  const handleGoalCreation = (): Promise<{text: string, options?: Partial<Message>}> => {
    const actions: ChatAction[] = [
      {
        label: "🏖️ Criar Meta de Viagem",
        action: () => {
          const success = addGoal({
            title: "Viagem dos Sonhos",
            targetAmount: 8000,
            currentAmount: 0,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
          });
          
          if (success) {
            toast({
              title: "🎯 Meta criada!",
              description: "Meta 'Viagem dos Sonhos' criada com sucesso",
              duration: 4000,
            });
            sendMessage("Meta de viagem criada! Como posso te ajudar a alcançá-la?");
          }
        }
      },
      {
        label: "🚨 Reserva de Emergência",
        action: () => {
          const targetAmount = financialData.totalExpenses * 6 || 15000;
          const success = addGoal({
            title: "Reserva de Emergência",
            targetAmount,
            currentAmount: 0,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
          });
          
          if (success) {
            toast({
              title: "🎯 Meta criada!",
              description: "Reserva de emergência configurada",
              duration: 4000,
            });
            sendMessage("Meta de reserva criada! Vou te ajudar com estratégias para alcançá-la.");
          }
        }
      },
      {
        label: "💰 Meta de Investimento",
        action: () => {
          const success = addGoal({
            title: "Carteira de Investimentos",
            targetAmount: 10000,
            currentAmount: 0,
            targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
          });
          
          if (success) {
            toast({
              title: "🎯 Meta criada!",
              description: "Meta de investimento criada",
              duration: 4000,
            });
            sendMessage("Meta de investimento criada! Que tal começarmos com a reserva de emergência?");
          }
        }
      }
    ];
    
    return Promise.resolve({
      text: "🎯 Criação de Metas Financeiras\n\nEscolha uma meta pré-configurada ou use o botão ➕ na seção \"Objetivos\" para criar uma personalizada:\n\n💡 Dica: Metas específicas e com prazo têm 3x mais chance de serem alcançadas!",
      options: {
        hasActions: true,
        actions,
        type: 'action'
      }
    });
  };

  const getContextualResponse = (message: string): Promise<{text: string, options?: Partial<Message>}> => {
    const responses = [
      {
        condition: (msg: string) => msg.includes('obrigad') || msg.includes('valeu'),
        response: "😊 Por nada! Estou aqui para te ajudar a conquistar seus objetivos financeiros. Sempre que precisar, é só chamar! 🚀"
      },
      {
        condition: (msg: string) => msg.includes('dúvida') || msg.includes('ajuda'),
        response: "🤝 Claro! Sou especialista em finanças pessoais. Pode me perguntar sobre:\n\n💰 Controle de gastos\n📈 Investimentos\n🎯 Metas financeiras\n💡 Dicas de economia\n📊 Análise de dados\n\nO que você gostaria de saber?"
      },
      {
        condition: (msg: string) => msg.includes('tchau') || msg.includes('até logo'),
        response: "👋 Até logo! Lembre-se: pequenas ações diárias levam a grandes conquistas financeiras. Nos vemos em breve! 💪"
      }
    ];
    
    const matchedResponse = responses.find(r => r.condition(message.toLowerCase()));
    
    if (matchedResponse) {
      return Promise.resolve({ text: matchedResponse.response });
    }
    
    const hasData = financialData.transactions.length > 0;
    const contextualResponses = hasData ? [
      `🤔 Interessante! Com base nos seus ${financialData.transactions.length} registros, posso te dar insights bem específicos. Me conte mais detalhes sobre o que você quer saber.`,
      `💡 Ótima pergunta! Vendo seu histórico financeiro, posso te dar dicas personalizadas. Quer que eu analise algum aspecto específico?`,
      `📊 Com seus dados atuais, posso fazer uma análise bem direcionada. Quer falar sobre economia, investimentos ou planejamento?`
    ] : [
      `🚀 Para te dar a melhor resposta possível, me conte mais detalhes! Posso ajudar com estratégias de economia, investimentos, ou controle de gastos.`,
      `💭 Essa é uma ótima área das finanças! Registre algumas transações para eu poder dar dicas mais personalizadas, ou me pergunte sobre estratégias gerais.`,
      `📚 Posso te ajudar com isso! Quanto mais específico você for, melhor posso te orientar. Qual é sua principal preocupação financeira?`
    ];
    
    return Promise.resolve({ 
      text: contextualResponses[Math.floor(Math.random() * contextualResponses.length)] 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const clearChat = () => {
    setMessages([]);
    setTimeout(() => {
      const welcomeMessage = getWelcomeMessage();
      setMessages([{
        id: '1',
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      }]);
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const quickQuestions = financialData.transactions.length > 0 ? [
    "📊 Como estou financeiramente?",
    "💡 Como posso economizar?",
    "🎯 Quero criar uma meta",
    "📈 Análise por categoria"
  ] : [
    "📝 Como registrar transações?",
    "💡 Dicas de economia",
    "🎯 Como definir metas?",
    "📚 Educação financeira"
  ];
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 right-6 w-80 ${expanded ? 'sm:w-[40rem] h-[85vh]' : 'sm:w-96'} bg-white rounded-2xl shadow-2xl border border-muted overflow-hidden z-50 dark:bg-card dark:border-border`}
          >
            <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 border-2 border-white/30">
                    <AvatarFallback className="bg-finance-accent text-white font-bold">
                      <Brain className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg leading-none">FinanceSense AI</h3>
                    <p className="text-xs text-white/90 mt-1 flex items-center">
                      {isTyping ? (
                        <>
                          <div className="flex space-x-1 mr-2">
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse dark:bg-card-foreground"></div>
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-100 dark:bg-card-foreground"></div>
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse delay-200 dark:bg-card-foreground"></div>
                          </div>
                          Analisando...
                        </>
                      ) : (
                        `Assistente Inteligente • ${financialData.transactions.length} transações`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {analysisMode && (
                    <Badge className="bg-white/20 text-white text-xs">
                      Modo Análise
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpanded(!expanded)}
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                    title={expanded ? 'Reduzir' : 'Expandir'}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAnalysisMode(!analysisMode)}
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                    title="Modo Análise"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                    title="Novo chat"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
                    title="Fechar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`overflow-y-auto p-4 space-y-4 ${expanded ? 'h-[calc(85vh-10rem)]' : 'max-h-96'}`}>
              {messages.map((message) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                >
                  {!message.isUser && (
                    <div className="mr-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Logo size={32} variant="default" />
                    </div>
                  )}
                  
                  <div className="max-w-[85%] space-y-2">
                    <div 
                      className={`p-4 rounded-2xl ${message.isUser 
                        ? 'bg-finance-primary text-white rounded-br-md' 
                        : message.isError
                          ? 'bg-red-50 border border-red-200 text-red-800 rounded-bl-md'
                          : message.type === 'analysis'
                            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 text-blue-900 rounded-bl-md'
                            : message.type === 'suggestion'
                              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-green-900 rounded-bl-md'
                              : 'bg-muted/80 dark:bg-muted dark:text-card-foreground rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {message.text}
                      </p>
                      <div className={`text-[11px] mt-3 ${
                        message.isUser 
                          ? 'text-white/70 text-right' 
                          : message.isError
                            ? 'text-red-600'
                            : 'text-muted-foreground'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    
                    {message.hasActions && message.actions && (
                      <div className="space-y-2">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={action.action}
                            className="w-full justify-start text-left h-auto py-2.5 px-3 bg-white border border-finance-primary/20 hover:bg-finance-light hover:text-finance-primary transition-colors text-xs dark:bg-muted dark:border-primary/20 dark:hover:bg-primary/10"
                          >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {message.isUser && (
                    <Avatar className="h-8 w-8 ml-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AvatarFallback className="bg-finance-accent/20 text-finance-accent text-xs font-bold">
                        EU
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="mr-3 mt-1">
                    <Logo size={32} variant="default" />
                  </div>
                  <div className="bg-muted/80 dark:bg-muted p-4 rounded-2xl rounded-bl-md max-w-[70%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-finance-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-finance-primary animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-finance-primary animate-bounce delay-200" />
                      </div>
                      <span className="text-xs text-muted-foreground">Analisando seus dados...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length <= 1 && !isTyping && (
              <div className="px-4 pb-3 border-t border-muted/30">
                <p className="text-xs text-muted-foreground mb-3 font-medium">💡 Perguntas rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage(question)}
                      className="justify-start text-left text-xs h-auto py-2.5 px-3 bg-muted/40 border-none hover:bg-finance-light hover:text-finance-primary transition-colors dark:bg-muted dark:hover:bg-muted/80 dark:text-card-foreground"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="border-t border-muted/30 p-4 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={analysisMode ? "Ex: analise meus gastos com alimentação" : "Digite sua pergunta sobre finanças..."}
                    className="w-full bg-muted/40 dark:bg-muted dark:text-card-foreground dark:placeholder-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-finance-primary/50 pr-12 transition-all"
                    maxLength={500}
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg bg-finance-primary hover:bg-finance-accent text-white dark:bg-primary dark:hover:bg-primary/80 transition-colors"
                    disabled={!input.trim() || isTyping}
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {input.length > 400 && (
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {input.length}/500 caracteres
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                💡 <strong>Dica:</strong> Digite <code>/ajuda</code> para ver comandos especiais
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-finance-primary to-finance-accent text-white p-4 rounded-full shadow-xl z-50 hover:shadow-2xl transition-all duration-300 group"
        title="Assistente Financeiro Inteligente"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="h-6 w-6" />
              {financialData.transactions.length > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-finance-primary px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity dark:bg-card dark:text-primary dark:border dark:border-border"
          >
            💬 Assistente IA
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-l-4 border-l-white border-y-4 border-y-transparent" />
          </motion.div>
        )}
      </motion.button>
    </>
  );
}; 