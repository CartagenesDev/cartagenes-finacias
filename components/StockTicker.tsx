import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { MarketData } from '../types';

interface StockTickerProps {
  data: MarketData[];
  loading?: boolean;
}

export const StockTicker: React.FC<StockTickerProps> = ({ data, loading }) => {
  // Se estiver carregando ou sem dados, mostra placeholders
  const displayData = data.length > 0 ? data : Array(10).fill({
    symbol: 'Carregando...', 
    regularMarketPrice: 0, 
    regularMarketChangePercent: 0 
  });

  return (
    <div className="bg-white border-b border-gray-200 py-2 overflow-hidden flex shadow-sm h-10 items-center">
      <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
        {/* Duplicamos a lista para criar o efeito infinito sem buracos */}
        {[...displayData, ...displayData].map((stock, index) => (
          <div key={`${stock.symbol}-${index}`} className="flex items-center gap-2 text-sm font-medium border-r border-gray-300 pr-6 last:border-none">
            <span className="text-gray-900 font-bold">{stock.symbol}</span>
            <span className="text-gray-600">
              {stock.regularMarketPrice ? 
                `R$ ${stock.regularMarketPrice.toFixed(2).replace('.', ',')}` : 
                '---'}
            </span>
            <span className={`flex items-center text-xs ${stock.regularMarketChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.regularMarketChangePercent >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(stock.regularMarketChangePercent || 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};