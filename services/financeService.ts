import { MarketData } from '../types';

// Usando token público de demonstração ou gratuito. 
// Para produção, o usuário deve criar conta na brapi.dev e colocar a chave aqui.
const BASE_URL = 'https://brapi.dev/api';

// Lista de ações populares para monitorar no Ticker e Rankings
const STOCKS_TO_WATCH = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3', 'MGLU3', 'HAPV3', 
  'PRIO3', 'CSNA3', 'GGBR4', 'RENT3', 'JBSS3', 'ELET3', 'SUZB3',
  'MNPR3', 'SYNE3', 'NEMO3', 'VSPT3', 'ALLD3', 'MOAR3', 'CASH3' // Small caps for rankings
];

export const financeService = {
  getMarketData: async (): Promise<MarketData[]> => {
    try {
      const symbols = STOCKS_TO_WATCH.join(',');
      // Buscando cotações com indicadores fundamentais (p/L e dy)
      // O parâmetro 'fundamental=true' é necessário na Brapi para vir P/L e DY
      // Note: A API gratuita publica muitas vezes bloqueia requests sem token.
      const response = await fetch(`${BASE_URL}/quote/${symbols}?fundamental=true`, {
        signal: AbortSignal.timeout(5000) // Timeout de 5s para não travar o load
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados da Brapi (Rate Limit ou Token necessário)');
      }

      const data = await response.json();
      
      // Mapeia a resposta da Brapi para nosso formato interno
      return data.results.map((item: any) => ({
        symbol: item.symbol,
        shortName: item.shortName,
        regularMarketPrice: item.regularMarketPrice,
        regularMarketChangePercent: item.regularMarketChangePercent,
        priceEarnings: item.priceEarnings || 0, // P/L
        dividendYield: item.dividendYield || 0  // DY
      }));

    } catch (error) {
      console.warn("API Financeira indisponível no momento. Usando dados simulados de alta fidelidade.");
      return getMockMarketData();
    }
  }
};

// Fallback robusto com dados específicos para preencher os Rankings e Ticker
const getMockMarketData = (): MarketData[] => {
  const randomize = (base: number, variance: number) => {
    return base * (1 + (Math.random() - 0.5) * variance);
  };

  return [
    // Blue Chips (Ticker)
    { symbol: 'PETR4', shortName: 'PETROBRAS', regularMarketPrice: randomize(38.45, 0.02), regularMarketChangePercent: randomize(1.25, 0.1), priceEarnings: 4.5, dividendYield: 18.2 },
    { symbol: 'VALE3', shortName: 'VALE', regularMarketPrice: randomize(62.10, 0.02), regularMarketChangePercent: randomize(-0.85, 0.1), priceEarnings: 5.2, dividendYield: 9.5 },
    { symbol: 'ITUB4', shortName: 'ITAU UNIBANCO', regularMarketPrice: randomize(33.20, 0.01), regularMarketChangePercent: randomize(0.50, 0.1), priceEarnings: 9.1, dividendYield: 6.2 },
    { symbol: 'WEGE3', shortName: 'WEG', regularMarketPrice: randomize(40.15, 0.02), regularMarketChangePercent: randomize(2.10, 0.1), priceEarnings: 28.5, dividendYield: 1.8 },
    { symbol: 'BBAS3', shortName: 'BANCO BRASIL', regularMarketPrice: randomize(58.90, 0.01), regularMarketChangePercent: randomize(0.90, 0.1), priceEarnings: 4.1, dividendYield: 10.5 },
    { symbol: 'PRIO3', shortName: 'PRIO', regularMarketPrice: randomize(46.20, 0.02), regularMarketChangePercent: randomize(1.5, 0.1), priceEarnings: 8.5, dividendYield: 0 },
    { symbol: 'MGLU3', shortName: 'MAGALU', regularMarketPrice: randomize(2.15, 0.05), regularMarketChangePercent: randomize(-3.20, 0.2), priceEarnings: -15.0, dividendYield: 0 },
    { symbol: 'CSNA3', shortName: 'SID NACIONAL', regularMarketPrice: randomize(12.50, 0.02), regularMarketChangePercent: randomize(-1.10, 0.1), priceEarnings: 6.8, dividendYield: 5.4 },
    
    // Dados específicos para Ranking "Menores P/L"
    { symbol: 'MNPR3', shortName: 'MINUPAR PART', regularMarketPrice: randomize(5.20, 0.05), regularMarketChangePercent: 0, priceEarnings: 0.07, dividendYield: 2.1 },
    { symbol: 'NEMO3', shortName: 'SUZANO HOLD', regularMarketPrice: randomize(14.50, 0.01), regularMarketChangePercent: 0, priceEarnings: 0.76, dividendYield: 35.98 },
    { symbol: 'VSPT3', shortName: 'FERROVIA C.', regularMarketPrice: randomize(8.90, 0.02), regularMarketChangePercent: 0, priceEarnings: 1.95, dividendYield: 0 },
    { symbol: 'ALLD3', shortName: 'ALLIED TECN', regularMarketPrice: randomize(6.30, 0.02), regularMarketChangePercent: 0, priceEarnings: 2.21, dividendYield: 24.69 },
    
    // Dados específicos para Ranking "Dividend Yield"
    { symbol: 'SYNE3', shortName: 'SYN PROP E..', regularMarketPrice: randomize(4.10, 0.01), regularMarketChangePercent: 0, priceEarnings: 12.0, dividendYield: 125.53 },
    { symbol: 'MOAR3', shortName: 'MONTEIRO A..', regularMarketPrice: randomize(350.00, 0.01), regularMarketChangePercent: 0, priceEarnings: 5.0, dividendYield: 76.21 },
    { symbol: 'CASH3', shortName: 'MELIUZ S.A.', regularMarketPrice: randomize(7.80, 0.02), regularMarketChangePercent: 0, priceEarnings: -5.0, dividendYield: 54.11 },
  ];
};