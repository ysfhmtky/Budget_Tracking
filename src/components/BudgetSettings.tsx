import React, { useState } from 'react';
import { Budget } from '../types/expense';
import { tr } from '../utils/translations';

interface BudgetSettingsProps {
  budget: Budget;
  onSave: (budget: Budget) => void;
}

export function BudgetSettings({ budget, onSave }: BudgetSettingsProps) {
  const [weekly, setWeekly] = useState(budget.weekly.toString());
  const [monthly, setMonthly] = useState(budget.monthly.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      weekly: parseFloat(weekly) || 0,
      monthly: parseFloat(monthly) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-900">{tr.buttons.budgetSettings}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weekly" className="block text-sm font-medium text-gray-700">
            {tr.labels.weeklyBudget}
          </label>
          <input
            type="number"
            id="weekly"
            value={weekly}
            onChange={(e) => setWeekly(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="monthly" className="block text-sm font-medium text-gray-700">
            {tr.labels.monthlyBudget}
          </label>
          <input
            type="number"
            id="monthly"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {tr.buttons.saveBudget}
      </button>
    </form>
  );
}