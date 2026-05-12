export const MARKET_DATA_PROVIDER = Symbol('MARKET_DATA_PROVIDER');

export type MarketTicker = string;

export interface QuoteSnapshot {
  symbol: string;
  regularMarketPrice: number | null;
  currency: string | null;
  shortName: string | null;
  asOf?: string;
}

export interface MarketDataProvider {
  getQuote(ticker: MarketTicker): Promise<QuoteSnapshot>;
}
