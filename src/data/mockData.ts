
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
