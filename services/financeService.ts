import { MarketData } from '../types';

// Usando token público de demonstração ou gratuito. 
// Para produção, o usuário deve criar conta na brapi.dev e colocar a chave aqui.
const BASE_URL = 'https://brapi.dev/api';
// Lista de ações populares para monitorar no Ticker e Rankings
const STOCKS_TO_WATCH = [
  'PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'BBAS3', 'WEGE3', 'MGLU3', 'HAPV3', 
  'PRIO3', 'CSNA3', 'GGBR4', 'RENT3', 'JBSS3', 'ELET3', 'SUZB3'
];

export const financeService = {
  getMarketData: async (): Promise<MarketData[]> => {
    try {
      const symbols = STOCKS_TO_WATCH.join(',');
      // Buscando cotações com indicadores fundamentais (p/L e dy)
      // O parâmetro 'fundamental=true' é necessário na Brapi para vir P/L e DY
      const response = await fetch(`${BASE_URL}/quote/${symbols}?fundamental=true`);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados da Brapi');
      }

      const data = await response.json();
      
      // Mapeia a resposta da Brapi para nosso formato interno
      return data.results.map((item: any) => ({
        symbol: item.symbol,
        shortName: item.shortName,
        regularMarketPrice: item.regularMarketPrice,
        regularMarketChangePercent: item.regularMarketChangePercent,
        priceEarnings: item.priceEarnings || 0, // P/L
        dividendYield: item.dividendYield || 0  // DY (Em format decimal, ex: 5% vem como 5 ou 0.05 dependendo da api, na Brapi geralmente é o valor absoluto)
      }));

    } catch (error) {
      console.error("Erro na API Financeira (usando fallback):", error);
      return getMockMarketData();
    }
  }
};

// Fallback caso a API falhe ou atinja limite
const getMockMarketData = (): MarketData[] => [
  { symbol: 'PETR4', shortName: 'PETROBRAS', regularMarketPrice: 38.45, regularMarketChangePercent: 1.25, priceEarnings: 4.5, dividendYield: 18.2 },
  { symbol: 'VALE3', shortName: 'VALE', regularMarketPrice: 62.10, regularMarketChangePercent: -0.85, priceEarnings: 5.2, dividendYield: 9.5 },
  { symbol: 'ITUB4', shortName: 'ITAU UNIBANCO', regularMarketPrice: 33.20, regularMarketChangePercent: 0.50, priceEarnings: 9.1, dividendYield: 6.2 },
  { symbol: 'WEGE3', shortName: 'WEG', regularMarketPrice: 40.15, regularMarketChangePercent: 2.10, priceEarnings: 28.5, dividendYield: 1.8 },
  { symbol: 'BBAS3', shortName: 'BANCO BRASIL', regularMarketPrice: 58.90, regularMarketChangePercent: 0.90, priceEarnings: 4.1, dividendYield: 10.5 },
  { symbol: 'PRIO3', shortName: 'PRIO', regularMarketPrice: 46.20, regularMarketChangePercent: 1.5, priceEarnings: 8.5, dividendYield: 0 },
  { symbol: 'MGLU3', shortName: 'MAGALU', regularMarketPrice: 2.15, regularMarketChangePercent: -3.20, priceEarnings: -15.0, dividendYield: 0 },
  { symbol: 'CSNA3', shortName: 'SID NACIONAL', regularMarketPrice: 12.50, regularMarketChangePercent: -1.10, priceEarnings: 6.8, dividendYield: 5.4 },
];