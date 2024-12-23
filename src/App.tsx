import React, { useState, useEffect } from 'react';
import { Download, Settings } from 'lucide-react';  // İkonlar
import { ExpenseForm } from './components/ExpenseForm';  // Gider formu bileşeni
import { ExpenseList } from './components/ExpenseList';  // Gider listesi bileşeni
import { Dashboard } from './components/Dashboard';  // Gösterge paneli bileşeni
import { BudgetSettings } from './components/BudgetSettings';  // Bütçe ayarları bileşeni
import { Expense, Budget } from './types/expense';  // Gider ve bütçe türleri
import { saveExpenses, getExpenses, saveBudget, getBudget } from './utils/storage';  // Depolama işlemleri için yardımcı fonksiyonlar
import { tr } from './utils/translations';  // Çeviri fonksiyonu (Türkçe metinler için)

function App() {
  // Giderler ve bütçe durumları için state (durum) tanımlıyoruz.
  const [expenses, setExpenses] = useState<Expense[]>([]);  // Giderleri saklamak için state
  const [budget, setBudget] = useState<Budget>({ weekly: 0, monthly: 0 });  // Haftalık ve aylık bütçe
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);  // Bütçe ayarlarının görünürlük durumu

  // Uygulama başladığında giderler ve bütçeyi localStorage'dan yükleyelim.
  useEffect(() => {
    setExpenses(getExpenses());  // Giderleri yükle
    setBudget(getBudget());  // Bütçeyi yükle
  }, []);

  // Yeni bir gider eklerken bu fonksiyon çalışacak
  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,  // Yeni gideri mevcut bilgilerle oluştur
      id: crypto.randomUUID(),  // Benzersiz bir ID oluştur
    };
    const updatedExpenses = [...expenses, expense];  // Giderleri güncelle
    setExpenses(updatedExpenses);  // Yeni gideri state'e kaydet
    saveExpenses(updatedExpenses);  // Giderleri localStorage'a kaydet
  };

  // Bir gideri silmek için bu fonksiyon kullanılır
  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);  // Silinecek gideri filtrele
    setExpenses(updatedExpenses);  // Gider listesini güncelle
    saveExpenses(updatedExpenses);  // Güncellenmiş giderleri localStorage'a kaydet
  };

  // Bütçe ayarlarını kaydetmek için kullanılan fonksiyon
  const handleSaveBudget = (newBudget: Budget) => {
    setBudget(newBudget);  // Yeni bütçeyi state'e kaydet
    saveBudget(newBudget);  // Bütçeyi localStorage'a kaydet
    setShowBudgetSettings(false);  // Bütçe ayarlarını gizle
  };

  // Giderleri CSV formatında dışa aktarmak için kullanılan fonksiyon
  const handleExportCSV = () => {
    const headers = [tr.labels.date, tr.labels.expenseName, tr.labels.category, tr.labels.amount];  // CSV başlıkları
    const csvContent = [
      headers.join(','),  // Başlıkları birleştir
      ...expenses.map((expense) =>
        [expense.date, expense.name, tr.categories[expense.category], expense.amount].join(',')
      ),  // Her gideri CSV formatında sıraya diz
    ].join('\n');  // Her satır arasında yeni satır ekle

    // CSV içeriğini Blob olarak oluştur ve indirme linki oluştur
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);  // CSV dosyasına bağlantı oluştur
    link.download = 'giderler.csv';  // İndirilen dosyanın ismi
    link.click();  // Bağlantıyı tıkla (indirme işlemi başlat)
  };

  return (
    <div className="min-h-screen bg-gray-100">  {/* Sayfanın temel düzeni */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">  {/* İçerik bölgesinin düzeni */}
        <div className="flex justify-between items-center mb-8">  {/* Başlık ve butonlar */}
          <h1 className="text-3xl font-bold text-gray-900">{tr.appTitle}</h1>  {/* Uygulama başlığı */}
          <div className="space-x-4">  {/* Butonlar arasındaki boşluk */}
            <button
              onClick={handleExportCSV}  // CSV dışa aktar butonu
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />  {/* İkon */}
              {tr.buttons.exportCsv}  {/* Çeviri ile buton metni */}
            </button>
            <button
              onClick={() => setShowBudgetSettings(!showBudgetSettings)}  // Bütçe ayarlarını göster/gizle butonu
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="w-4 h-4 mr-2" />  {/* İkon */}
              {tr.buttons.budgetSettings}  {/* Çeviri ile buton metni */}
            </button>
          </div>
        </div>

        <div className="space-y-8">  {/* Bileşenler arasındaki boşluk */}
          {showBudgetSettings && (
            <BudgetSettings budget={budget} onSave={handleSaveBudget} />
          )}
          {/* Bütçe ayarları bileşeni */}

          <ExpenseForm onSubmit={handleAddExpense} />  {/* Gider ekleme formu */}
          
          <Dashboard expenses={expenses} budget={budget} />  {/* Gösterge paneli */}
          
          <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />  {/* Giderler listesi */}
        </div>
      </div>
    </div>
  );
}

export default App;
