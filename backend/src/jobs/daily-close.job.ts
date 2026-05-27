import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as marketDataProviderTypes from 'src/market-data/market-data-provider.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { WatchlistService } from 'src/watchlist/watchlist.service';

@Injectable()
export class DailyCloseJob {
  private readonly logger = new Logger(DailyCloseJob.name);

  constructor(
    @Inject(marketDataProviderTypes.Symbol_marketDataProvider)
    private readonly marketData: marketDataProviderTypes.MarketDataProvider,
    private readonly watchlist: WatchlistService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron('30 18 * * 1-5', { timeZone: 'America/Sao_Paulo' })
  async run() {
    const tickers = await this.watchlist.getActiveTickers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const ticker of tickers) {
      try {
        const candles = await this.marketData.getHistory(ticker, 1);
        const candle = candles[0];
        if (!candle) continue;

        await this.prisma.dailyPrice.upsert({
          where: { ticker_date: { ticker: ticker, date: today } },
          update: {
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
            source: 'yahoo',
            fetchedAt: new Date(),
          },
          create: {
            ticker: candle.symbol,
            date: today,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
            volume: candle.volume,
            source: 'yahoo',
            fetchedAt: new Date(),
          },
        });
        this.logger.log(`${ticker} salvo no DB.`);
      } catch (error) {
        this.logger.error(`Erro ao salvar ${ticker} => ${error}`);
      }
    }
  }
}
