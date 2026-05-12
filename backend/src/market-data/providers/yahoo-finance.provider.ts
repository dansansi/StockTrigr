import { Injectable } from '@nestjs/common';
import {
  MarketDataProvider,
  StockName,
  QuoteSnapshot,
} from '../market-data-provider.types';
import YahooFinance from 'yahoo-finance2';

@Injectable()
export class YahooFinanceProvider implements MarketDataProvider {
  private readonly yf = new YahooFinance();

  async getQuote(tickers: StockName[]): Promise<QuoteSnapshot[]> {
    try {
      const results = await this.yf.quote(tickers);

      return results.map((result) => ({
        symbol: result.symbol,
        regularMarketPrice: result.regularMarketPrice ?? null,
        currency: result.currency ?? null,
        shortName: result.shortName ?? null,
      }));
    } catch (error) {
      throw new Error(`Falha ao buscar valores. Erro: ${error}`);
    }
  }
}
