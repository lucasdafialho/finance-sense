import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  timestamp: string;
}

interface Category {
  category: string;
  amount: number;
  color: string;
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  isFromSuggestion?: boolean;
  monthlySavings?: number;
}

interface AppliedSuggestion {
  id: number;
  title: string;
  potentialSavings: number;
  appliedDate: string;
}

interface FinancialData {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  appliedSuggestions: AppliedSuggestion[];
  totalIncome: number;
  totalExpenses: number;
  currentSavings: number;
}

interface TransactionInput {
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const STORAGE_KEYS = {
  transactions: 'financeSenseTransactions',
  categories: 'financeSenseCategories',
  goals: 'financeSenseGoals',
  appliedSuggestions: 'financeSenseAppliedSuggestions',
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Alimentação': '#A1EBD0',
    'Transporte': '#548687',
    'Moradia': '#77C9A4',
    'Entretenimento': '#B39DDB',
    'Saúde': '#90CAF9',
    'Compras': '#FFD54F',
    'Renda': '#81C784',
    'Transferência': '#81C784',
    'Outros': '#FFAB91'
  };
  return colors[category] || '#FFAB91';
};

const parseNaturalLanguageInput = (input: string): TransactionInput | null => {
  const lowerInput = input.toLowerCase();
  
  // Extrair valor em reais
  const amountMatch = input.match(/r?\$?\s*(\d+(?:[.,]\d{1,2})?)/i);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1].replace(',', '.'));
  if (isNaN(amount) || amount <= 0) return null;
  
  // Determinar tipo
  const isIncome = lowerInput.includes('recebi') || lowerInput.includes('ganhei') || 
                   lowerInput.includes('entrada') || lowerInput.includes('salário') ||
                   lowerInput.includes('renda');
  
  // Categorizar automaticamente
  let category = 'Outros';
  
  if (lowerInput.includes('mercado') || lowerInput.includes('supermercado') || 
      lowerInput.includes('comida') || lowerInput.includes('almoço') || 
      lowerInput.includes('jantar') || lowerInput.includes('restaurante') ||
      lowerInput.includes('lanche') || lowerInput.includes('delivery')) {
    category = 'Alimentação';
  } else if (lowerInput.includes('uber') || lowerInput.includes('táxi') || 
             lowerInput.includes('ônibus') || lowerInput.includes('transporte') ||
             lowerInput.includes('combustível') || lowerInput.includes('gasolina')) {
    category = 'Transporte';
  } else if (lowerInput.includes('aluguel') || lowerInput.includes('condomínio') ||
             lowerInput.includes('água') || lowerInput.includes('luz') ||
             lowerInput.includes('internet') || lowerInput.includes('energia')) {
    category = 'Moradia';
  } else if (lowerInput.includes('cinema') || lowerInput.includes('show') ||
             lowerInput.includes('festa') || lowerInput.includes('lazer')) {
    category = 'Entretenimento';
  } else if (lowerInput.includes('médico') || lowerInput.includes('farmácia') ||
             lowerInput.includes('medicamento') || lowerInput.includes('saúde')) {
    category = 'Saúde';
  } else if (lowerInput.includes('roupa') || lowerInput.includes('shopping') ||
             lowerInput.includes('compra')) {
    category = 'Compras';
  } else if (isIncome) {
    category = 'Renda';
  }
  
  return {
    description: input.trim(),
    amount,
    category,
    type: isIncome ? 'income' : 'expense'
  };
};

export const useFinancialData = () => {
  const [data, setData] = useState<FinancialData>({
    transactions: [],
    categories: [],
    goals: [],
    appliedSuggestions: [],
    totalIncome: 0,
    totalExpenses: 0,
    currentSavings: 8500,
  });

  const loadData = () => {
    try {
      const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) || '[]');
      const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories) || '[]');
      const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.goals) || '[]');
      const appliedSuggestions = JSON.parse(localStorage.getItem(STORAGE_KEYS.appliedSuggestions) || '[]');

      const totalIncome = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      
      const totalExpenses = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      setData({
        transactions,
        categories,
        goals,
        appliedSuggestions,
        totalIncome,
        totalExpenses,
        currentSavings: Math.max(0, 8500 + totalIncome - totalExpenses),
      });
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    }
  };

  const addTransactionFromInput = (input: string): boolean => {
    const parsed = parseNaturalLanguageInput(input);
    if (!parsed) return false;
    
    return addTransaction(parsed);
  };

  const addTransaction = (transactionData: TransactionInput): boolean => {
    try {
      const newTransaction: Transaction = {
        ...transactionData,
        id: `tx-${Date.now()}`,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('pt-BR')
      };

      const existingTransactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions) || '[]');
      const updatedTransactions = [newTransaction, ...existingTransactions].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(updatedTransactions));
      
      // Atualizar categorias apenas para despesas
      if (transactionData.type === 'expense') {
        updateCategoryAmount(transactionData.category, transactionData.amount);
      }
      
      loadData();
      
      // Disparar evento
      window.dispatchEvent(new CustomEvent('transactionAdded', { detail: newTransaction }));
      
      return true;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      return false;
    }
  };

  const updateCategoryAmount = (categoryName: string, amount: number) => {
    try {
      const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories) || '[]');
      const categoryIndex = categories.findIndex((cat: Category) => cat.category === categoryName);
      
      if (categoryIndex >= 0) {
        categories[categoryIndex].amount += amount;
      } else {
        categories.push({
          category: categoryName,
          amount: amount,
          color: getCategoryColor(categoryName),
        });
      }
      
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  const addGoal = (goal: Omit<Goal, 'id'>): boolean => {
    try {
      const newGoal: Goal = {
        ...goal,
        id: `goal-${Date.now()}`,
      };

      const existingGoals = JSON.parse(localStorage.getItem(STORAGE_KEYS.goals) || '[]');
      const updatedGoals = [...existingGoals, newGoal];
      localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(updatedGoals));
      
      loadData();
      return true;
    } catch (error) {
      console.error('Erro ao adicionar meta:', error);
      return false;
    }
  };

  const updateGoalProgress = (goalId: string, amount: number): boolean => {
    try {
      const goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.goals) || '[]');
      const goalIndex = goals.findIndex((g: Goal) => g.id === goalId);
      
      if (goalIndex >= 0) {
        goals[goalIndex].currentAmount = Math.min(
          goals[goalIndex].currentAmount + amount,
          goals[goalIndex].targetAmount
        );
        localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
        loadData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar progresso da meta:', error);
      return false;
    }
  };

  const applySuggestion = (suggestion: any): boolean => {
    try {
      const appliedSuggestions = JSON.parse(localStorage.getItem(STORAGE_KEYS.appliedSuggestions) || '[]');
      
      if (!appliedSuggestions.find((s: AppliedSuggestion) => s.id === suggestion.id)) {
        const newApplied: AppliedSuggestion = {
          id: suggestion.id,
          title: suggestion.title,
          potentialSavings: suggestion.potentialSavings,
          appliedDate: new Date().toLocaleDateString('pt-BR'),
        };
        
        appliedSuggestions.push(newApplied);
        localStorage.setItem(STORAGE_KEYS.appliedSuggestions, JSON.stringify(appliedSuggestions));
        
        // Criar meta de economia
        addGoal({
          title: `💰 ${suggestion.title}`,
          targetAmount: suggestion.potentialSavings * 12,
          currentAmount: 0,
          targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
          category: 'economia',
          isFromSuggestion: true,
          monthlySavings: suggestion.potentialSavings,
        });
        
        loadData();
        
        // Disparar evento
        window.dispatchEvent(new CustomEvent('suggestionApplied', { detail: newApplied }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao aplicar sugestão:', error);
      return false;
    }
  };

  const clearData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      loadData();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  useEffect(() => {
    loadData();

    const handleTransactionAdded = () => loadData();
    const handleSuggestionApplied = () => loadData();

    window.addEventListener('transactionAdded', handleTransactionAdded);
    window.addEventListener('suggestionApplied', handleSuggestionApplied);

    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
      window.removeEventListener('suggestionApplied', handleSuggestionApplied);
    };
  }, []);

  return {
    data,
    addTransaction,
    addTransactionFromInput,
    addGoal,
    updateGoalProgress,
    applySuggestion,
    clearData,
    refreshData: loadData,
    parseNaturalLanguageInput,
    getCategoryColor,
  };
}; 