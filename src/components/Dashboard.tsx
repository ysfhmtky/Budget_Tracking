import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense } from '../types/expense';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { tr as locale } from 'date-fns/locale';
import { tr } from '../utils/translations';

interface DashboardProps {
  expenses: Expense[];
  budget: { weekly: number; monthly: number };
}

export function Dashboard({ expenses, budget }: DashboardProps) {
  const today = new Date();

  // Haftalık hesaplamalar
  const weekStart = startOfWeek(today);  // Haftanın başlangıcı
  const weekEnd = endOfWeek(today);  // Haftanın bitişi

  // Haftalık harcama tutarlarını hesaplamak
  const dailyTotals = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart && expenseDate <= weekEnd;  // Bu tarih aralığındaki harcamalar
    })
    .reduce((acc, expense) => {
      const date = format(new Date(expense.date), 'EEE', { locale });  // Gün ismini alıyoruz
      acc[date] = (acc[date] || 0) + expense.amount;  // Aynı gün için giderleri topluyoruz
      return acc;
    }, {} as Record<string, number>);

  // Haftalık veriyi hazırlıyoruz (gün bazında)
  const weeklyData = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((date) => ({
    day: format(date, 'EEE', { locale }),  // Gün adı
    amount: dailyTotals[format(date, 'EEE', { locale })] || 0,  // Günlük harcama
  }));

  // Haftalık toplam harcama ve kalan bütçe
  const weeklyTotal = Object.values(dailyTotals).reduce((sum, amount) => sum + amount, 0);
  const weeklyBudgetRemaining = budget.weekly - weeklyTotal;

  // Aylık hesaplamalar
  const monthStart = startOfMonth(today);  // Ayın başlangıcı
  const monthEnd = endOfMonth(today);  // Ayın bitişi

  // Aylık harcama tutarlarını hesaplamak
  const monthlyTotals = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;  // Bu tarih aralığındaki harcamalar
    })
    .reduce((acc, expense) => {
      const date = format(new Date(expense.date), 'MMM dd', { locale });  // Ay gün formatında tarih
      acc[date] = (acc[date] || 0) + expense.amount;  // Aynı gün için giderleri topluyoruz
      return acc;
    }, {} as Record<string, number>);

  // Aylık veriyi hazırlıyoruz (gün bazında)
  const monthlyData = eachDayOfInterval({ start: monthStart, end: monthEnd }).map((date) => ({
    day: format(date, 'MMM dd', { locale }),  // Ay-Gün formatında tarih
    amount: monthlyTotals[format(date, 'MMM dd', { locale })] || 0,  // Günlük harcama, eksikse 0
  }));

  // Aylık toplam harcama ve kalan bütçe
  const monthlyTotal = Object.values(monthlyTotals).reduce((sum, amount) => sum + amount, 0);
  const monthlyBudgetRemaining = budget.monthly - monthlyTotal;

  return (
    <div className="space-y-6">
      {/* Haftalık Genel Bakış */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Haftalık Genel Bakış Paneli */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{tr.dashboard.weeklyOverview}</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {tr.dashboard.totalSpent}: <span className="font-medium text-gray-900">₺{weeklyTotal.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600">
              {tr.dashboard.budgetRemaining}:{' '}
              <span className={`font-medium ${weeklyBudgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₺{weeklyBudgetRemaining.toFixed(2)}
              </span>
            </p>
            {/* Haftalık bütçe doluluk oranını gösteren progress bar */}
            {budget.weekly > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      weeklyBudgetRemaining >= 0 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                    style={{
                      width: `${Math.min((weeklyTotal / budget.weekly) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Aylık Genel Bakış Paneli */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{tr.dashboard.monthlyOverview}</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {tr.dashboard.totalSpent}: <span className="font-medium text-gray-900">₺{monthlyTotal.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-600">
              {tr.dashboard.budgetRemaining}:{' '}
              <span className={`font-medium ${monthlyBudgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₺{monthlyBudgetRemaining.toFixed(2)}
              </span>
            </p>
            {/* Aylık bütçe doluluk oranını gösteren progress bar */}
            {budget.monthly > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      monthlyBudgetRemaining >= 0 ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                    style={{
                      width: `${Math.min((monthlyTotal / budget.monthly) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Haftalık Harcama Grafiği */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{tr.dashboard.weeklySpending}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₺${value}`} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Aylık Harcama Grafiği */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{tr.dashboard.monthlySpending}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => `₺${value}`} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
