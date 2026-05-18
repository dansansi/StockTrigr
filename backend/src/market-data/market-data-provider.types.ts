export const marketDataProvider = Symbol('Market_Data_Provider');

export type StockName = string;

export interface QuoteSnapshot {
  symbol: string;
  regularMarketPrice: number | null;
  currency: string | null;
  shortName: string | null;
}

export interface DailyCandle {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
}

export interface MarketDataProvider {
  getQuote(tickers: StockName[]): Promise<QuoteSnapshot[]>;
  getHistory(ticker: StockName, candles: number): Promise<DailyCandle[]>;
}
