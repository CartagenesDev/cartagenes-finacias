import React, { useState } from 'react';
import { X, DollarSign, Calendar, Percent } from 'lucide-react';
import { CalculatorResult } from '../types';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(10); // Annual
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<CalculatorResult | null>(null);

  if (!isOpen) return null;

  const calculate = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    
    // Future Value of Initial Investment
    const fvInitial = initial * Math.pow(1 + r, n);
    
    // Future Value of Monthly Contributions
    const fvMonthly = monthly * ((Math.pow(1 + r, n) - 1) / r);
    
    const total = fvInitial + fvMonthly;
    const totalInvested = initial + (monthly * n);
    const interest = total - totalInvested;

    setResult({ total, interest });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
        <div className="bg-brand-red p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Calculadora de Juros Compostos
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investimento Inicial (R$)</label>
            <input 
              type="number" 
              value={initial} 
              onChange={e => setInitial(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aporte Mensal (R$)</label>
            <input 
              type="number" 
              value={monthly} 
              onChange={e => setMonthly(Number(e.target.value))}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Percent className="w-3 h-3" /> Taxa Anual (%)
              </label>
              <input 
                type="number" 
                value={rate} 
                onChange={e => setRate(Number(e.target.value))}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-brand-red focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Tempo (Anos)
              </label>
              <input 
                type="number" 
                value={years} 
                onChange={e => setYears(Number(e.target.value))}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-brand-red focus:outline-none"
              />
            </div>
          </div>

          <button 
            onClick={calculate}
            className="w-full bg-brand-red text-white font-bold py-3 rounded hover:bg-brand-dark transition shadow-lg"
          >
            Calcular
          </button>

          {result && (
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Total Acumulado:</span>
                <span className="text-xl font-bold text-green-600">
                  {result.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total em Juros:</span>
                <span className="font-medium text-brand-red">
                  {result.interest.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};