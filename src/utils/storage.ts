import { Expense, Budget } from '../types/expense';

const EXPENSES_KEY = 'expenses';
const BUDGET_KEY = 'budget';

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const getExpenses = (): Expense[] => {
  const expenses = localStorage.getItem(EXPENSES_KEY);
  return expenses ? JSON.parse(expenses) : [];
};

export const saveBudget = (budget: Budget): void => {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
};

export const getBudget = (): Budget => {
  const budget = localStorage.getItem(BUDGET_KEY);
  return budget ? JSON.parse(budget) : { weekly: 0, monthly: 0 };
};