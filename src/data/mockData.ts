// Dados fictícios para o aplicativo FinanceSense

// Dados para resumo financeiro
export const financialSummary = {
  totalExpenses: 2450.75,
  totalIncome: 6500.00,
  balance: 4049.25,
  savingsGoal: 10000,
  currentSavings: 8500,
  month: "Maio",
  year: 2025
};

// Dados para gráfico de categorias de gastos
export const expenseCategories = [
  { category: "Moradia", amount: 1200, color: "#77C9A4" },
  { category: "Alimentação", amount: 650, color: "#A1EBD0" },
  { category: "Transporte", amount: 280, color: "#548687" },
  { category: "Entretenimento", amount: 150, color: "#B39DDB" },
  { category: "Saúde", amount: 90, color: "#90CAF9" },
  { category: "Outros", amount: 80.75, color: "#FFD54F" }
];

// Dados para gráfico de tendência de gastos (últimos 7 dias)
export const dailyExpenses = [
  { day: "Seg", date: "05", amount: 125.50 },
  { day: "Ter", date: "06", amount: 85.30 },
  { day: "Qua", date: "07", amount: 197.20 },
  { day: "Qui", date: "08", amount: 340.00 },
  { day: "Sex", date: "09", amount: 452.25 },
  { day: "Sáb", date: "10", amount: 180.00 },
  { day: "Dom", date: "11", amount: 70.50 }
];

// Sugestões de economia
export const savingSuggestions = [
  { 
    id: 1,
    title: "Reduza gastos com delivery",
    description: "Você gastou R$320 com delivery este mês, 40% a mais que o mês passado. Considere cozinhar mais em casa.",
    potentialSavings: 150
  },
  {
    id: 2,
    title: "Assinaturas não utilizadas",
    description: "Você tem 3 assinaturas que usa menos de 1x por semana. Cancelá-las pode economizar R$75/mês.",
    potentialSavings: 75
  },
  {
    id: 3,
    title: "Transporte alternativo",
    description: "Usando transporte público 2x por semana em vez de carro/app, você economizaria cerca de R$120/mês.",
    potentialSavings: 120
  }
];

// Dados do usuário
export const userData = {
  name: "Luciana",
  photo: "/placeholder.svg",
  lastLogin: "11 Mai, 08:30"
};

export const alertsData = [
  {
    id: 'alert1',
    message: 'Você gastou 25% acima da média na categoria Lazer este mês.',
    severity: 'high',
    date: '12 de maio, 2024',
  },
  {
    id: 'alert2',
    message: 'Sua fatura do cartão vence em 3 dias. Total: R$ 1.450,00',
    severity: 'medium',
    date: '11 de maio, 2024',
  },
  {
    id: 'alert3',
    message: 'Detectamos gastos recorrentes em streamings que somam R$ 97,80/mês',
    severity: 'medium',
    date: '10 de maio, 2024',
  }
];

export const financialGoals = [
  {
    id: 'goal1',
    title: 'Viagem para Paris',
    currentAmount: 4500,
    targetAmount: 8000,
    targetDate: 'Julho 2024',
  },
  {
    id: 'goal2',
    title: 'Fundo de emergência',
    currentAmount: 3200,
    targetAmount: 10000,
    targetDate: 'Dezembro 2024',
  },
  {
    id: 'goal3',
    title: 'Novo notebook',
    currentAmount: 2800,
    targetAmount: 5000,
    targetDate: 'Agosto 2024',
  }
];

export const transactions = [
  {
    id: 'tx1',
    description: 'Supermercado Extra',
    amount: 187.45,
    date: '11 mai, 2024',
    category: 'Alimentação',
    type: 'expense'
  },
  {
    id: 'tx2',
    description: 'Transferência recebida',
    amount: 1200.00,
    date: '10 mai, 2024',
    category: 'Transferência',
    type: 'income'
  },
  {
    id: 'tx3',
    description: 'Restaurante Sabor & Arte',
    amount: 89.90,
    date: '09 mai, 2024',
    category: 'Alimentação',
    type: 'expense'
  },
  {
    id: 'tx4',
    description: 'Uber',
    amount: 24.50,
    date: '08 mai, 2024',
    category: 'Transporte',
    type: 'expense'
  },
  {
    id: 'tx5',
    description: 'Shopping Center Norte',
    amount: 349.90,
    date: '07 mai, 2024',
    category: 'Compras',
    type: 'expense'
  },
  {
    id: 'tx6',
    description: 'Aluguel',
    amount: 1800.00,
    date: '05 mai, 2024',
    category: 'Moradia',
    type: 'expense'
  }
];

export const economyTips = [
  {
    id: 'tip1',
    title: 'Use cashback ao abastecer',
    description: 'Aplicativos de cashback para postos de combustível podem gerar economia de até 5% em cada abastecimento.',
    potentialSavings: 'R$ 30-50/mês'
  },
  {
    id: 'tip2',
    title: 'Negocie dívidas com juros altos',
    description: 'Consolidar suas dívidas ou buscar portabilidade de crédito pode reduzir significativamente os juros pagos mensalmente.',
    potentialSavings: 'R$ 100-300/mês'
  },
  {
    id: 'tip3',
    title: 'Revise assinaturas não utilizadas',
    description: 'Cancele serviços de streaming, apps e clubes de assinatura que você não usa regularmente.',
    potentialSavings: 'R$ 50-150/mês'
  },
  {
    id: 'tip4',
    title: 'Planeje refeições semanalmente',
    description: 'Fazer uma lista de compras e planejar refeições pode reduzir gastos com delivery e evitar desperdícios.',
    potentialSavings: 'R$ 200-400/mês'
  }
];

export const suggestedQuestions = [
  "Onde posso economizar este mês?",
  "Qual foi meu maior gasto por categoria?",
  "Como estou em relação às minhas metas financeiras?",
  "Quanto gastei com restaurantes no último mês?",
  "Qual a melhor forma de investir R$ 500 por mês?"
];

export const financialSimulations = [
  {
    id: 'delivery',
    name: 'Delivery',
    defaultAmount: 200,
    defaultMonths: 12,
    minAmount: 50,
    maxAmount: 500,
    step: 10,
    resultText: 'Se você reduzir R$ {amount} por mês em delivery, em {months} meses você economizará:',
  },
  {
    id: 'coffee',
    name: 'Café fora',
    defaultAmount: 10,
    defaultMonths: 12,
    minAmount: 5,
    maxAmount: 30,
    step: 1,
    resultText: 'Economizando R$ {amount} diário em café (20 dias úteis), em {months} meses você terá:',
  },
  {
    id: 'subscription',
    name: 'Assinaturas',
    defaultAmount: 100,
    defaultMonths: 12,
    minAmount: 20,
    maxAmount: 300,
    step: 5,
    resultText: 'Cancelando R$ {amount} de assinaturas mensais, em {months} meses você guardará:',
  }
];
