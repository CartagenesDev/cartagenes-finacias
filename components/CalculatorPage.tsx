
import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Percent, RefreshCw, Save } from 'lucide-react';
import { CalculatorResult } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CalculatorPage: React.FC = () => {
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [rate, setRate] = useState(0); // Annual
  const [years, setYears] = useState(0);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Optional: Auto-calculate on load or keep empty. 
  }, []);

  const calculate = () => {
    if (years <= 0) return;

    const totalMonths = years * 12;
    
    // Use Equivalent Monthly Rate for Brazilian Standard (Taxa Equivalente)
    let r = 0;
    if (rate > 0) {
      r = Math.pow(1 + rate / 100, 1 / 12) - 1;
    }
    
    let fvInitial = 0;
    let fvMonthly = 0;

    if (rate === 0) {
        fvInitial = initial;
        fvMonthly = monthly * totalMonths;
    } else {
        fvInitial = initial * Math.pow(1 + r, totalMonths);
        fvMonthly = monthly * ((Math.pow(1 + r, totalMonths) - 1) / r);
    }
    
    const total = fvInitial + fvMonthly;
    const totalInvested = initial + (monthly * totalMonths);
    const interest = total - totalInvested;

    setResult({ total, interest });

    const data = [];
    for (let m = 0; m <= totalMonths; m++) {
      const investedNow = initial + (monthly * m);
      let amountNow = 0;
      if (rate === 0) {
         amountNow = investedNow;
      } else {
         amountNow = (initial * Math.pow(1 + r, m)) + (monthly * ((Math.pow(1 + r, m) - 1) / r));
      }
      
      const interestNow = amountNow - investedNow;

      data.push({
        month: m,
        invested: parseFloat(investedNow.toFixed(2)),
        interest: parseFloat(interestNow.toFixed(2)),
        total: parseFloat(amountNow.toFixed(2))
      });
    }
    setChartData(data);
  };

  const clear = () => {
    setInitial(0);
    setMonthly(0);
    setRate(0);
    setYears(0);
    setResult(null);
    setChartData([]);
  };

  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatCurrencyInput = (val: number) => {
    if (val === 0) return '';
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: number) => void) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const newValue = Number(rawValue) / 100;
    setter(newValue);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Simulador de Juros Compostos</h2>
        <p className="text-gray-600 mt-2">Calcule o crescimento do seu patrimônio ao longo do tempo</p>
      </div>

      {/* Inputs Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-brand-gold" /> Investimento Inicial
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                <input 
                  type="text" 
                  value={formatCurrencyInput(initial)} 
                  onChange={(e) => handleCurrencyChange(e, setInitial)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-brand-gold" /> Aporte Mensal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">R$</span>
                <input 
                  type="text" 
                  value={formatCurrencyInput(monthly)} 
                  onChange={(e) => handleCurrencyChange(e, setMonthly)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Percent className="w-4 h-4 text-brand-gold" /> Taxa de Juros (Anual)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={rate || ''} 
                  onChange={e => setRate(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
                <span className="absolute right-3 top-3 text-gray-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-gold" /> Período (Anos)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={years || ''} 
                  onChange={e => setYears(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                />
                <span className="absolute right-3 top-3 text-gray-500">anos</span>
              </div>
            </div>
        </div>

        <div className="mt-6 flex gap-4 justify-end border-t border-gray-100 pt-6">
            <button 
              onClick={clear}
              className="px-6 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Limpar
            </button>
            <button 
              onClick={calculate}
              className="px-8 py-2 bg-brand-gold text-white font-bold rounded-lg hover:bg-brand-dark transition shadow-md transform hover:-translate-y-0.5"
            >
              Calcular
            </button>
        </div>
      </div>

      {result && (
        <div className="space-y-8"> 
          
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
             <h3 className="text-2xl font-bold text-brand-gold">Resultado</h3>
             <button className="flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white px-4 py-2 rounded shadow transition font-medium">
                <Save className="w-4 h-4" /> Salvar
             </button>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Card 1 - Final Total - Updated color to Gold Dark */}
             <div className="bg-brand-dark text-white rounded-lg p-6 shadow-md flex flex-col items-center justify-center text-center h-32">
                <span className="text-white/90 font-medium text-sm mb-1">Valor total final</span>
                <span className="text-3xl font-bold">{formatCurrency(result.total)}</span>
             </div>

             {/* Card 2 - Invested */}
             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center h-32">
                <span className="text-gray-600 font-medium text-sm mb-1">Valor total investido</span>
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(initial + (monthly * years * 12))}</span>
             </div>

             {/* Card 3 - Interest */}
             <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col items-center justify-center text-center h-32">
                <span className="text-gray-600 font-medium text-sm mb-1">Total em juros</span>
                <span className="text-2xl font-bold text-brand-gold">{formatCurrency(result.interest)}</span>
             </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-center font-bold text-brand-dark text-xl mb-6">Projeção Gráfica</h4>
            <div style={{ width: '100%', height: 400 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart
                   data={chartData}
                   margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                 >
                   <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                   <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      tick={{fontSize: 12}}
                      minTickGap={30}
                      label={{ value: 'Meses', position: 'insideBottomRight', offset: -5, fill: '#666' }}
                   />
                   <YAxis 
                      stroke="#6b7280"
                      tick={{fontSize: 12}}
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                   />
                   <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Mês ${label}`}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                   />
                   <Legend verticalAlign="top" height={36} iconType="plainline" wrapperStyle={{ paddingBottom: '10px' }} />
                   
                   {/* Total Line (Green like screenshot) */}
                   <Line 
                      type="monotone" 
                      dataKey="total" 
                      name="Total Acumulado" 
                      stroke="#10b981" 
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6 }}
                   />

                   {/* Invested Line (Dark like screenshot) */}
                   <Line 
                      type="monotone" 
                      dataKey="invested" 
                      name="Valor Investido" 
                      stroke="#1f2937" 
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200">
               <h4 className="text-lg font-bold text-brand-gold text-center">Tabela: Evolução do Patrimônio</h4>
             </div>
             <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mês</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Juros (Acumulado)</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Investido</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Acumulado</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                      {chartData.map((row, index) => (
                          <tr key={index} className="hover:bg-yellow-50 transition-colors">
                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{row.month}</td>
                             <td className="px-6 py-3 whitespace-nowrap text-sm text-green-600 font-medium">{formatCurrency(row.interest)}</td>
                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{formatCurrency(row.invested)}</td>
                             <td className="px-6 py-3 whitespace-nowrap text-sm text-brand-gold font-bold">{formatCurrency(row.total)}</td>
                          </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

        </div>
      )}
    </div>
  );
};
