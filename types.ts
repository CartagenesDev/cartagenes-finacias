export interface Stock {
  ticker: string;
  price: string;
  change: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
}

export interface CalculatorResult {
  total: number;
  interest: number;
}

export interface MarketData {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  priceEarnings: number | null; // P/L
  dividendYield: number | null; // DY
}