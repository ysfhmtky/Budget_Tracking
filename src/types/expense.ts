export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'utilities'
  | 'shopping'
  | 'health'
  | 'other';

export interface Expense {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
}

export interface Budget {
  weekly: number;
  monthly: number;
}