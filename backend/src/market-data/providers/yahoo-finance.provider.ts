import { Injectable } from '@nestjs/common';
import {
  MarketDataProvider,
  StockName,
  QuoteSnapshot,
  DailyCandle,
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

  async getHistory(ticker: StockName, candles: number): Promise<DailyCandle[]> {
    try {
      const period1 = this.getPeriodStart(candles);

      const result = await this.yf.chart(ticker, {
        period1,
        interval: '1d',
      });

      return result.quotes.map((q) => ({
        symbol: ticker,
        date: q.date,
        open: parseFloat(q.open!.toFixed(2)) ?? null,
        high: parseFloat(q.high!.toFixed(2)) ?? null,
        low: parseFloat(q.low!.toFixed(2)) ?? null,
        close: parseFloat(q.close!.toFixed(2)) ?? null,
        volume: q.volume ?? null,
      }));
    } catch (error) {
      throw new Error(
        `Falha ao buscar histórico de ${ticker}. Erro => ${error}`,
      );
    }
  }

  private getPeriodStart(candles: number): string {
    const date = new Date();
    date.setDate(date.getDate() - candles * 2);
    return date.toISOString().split('T')[0];
  }
}
