import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WatchlistService } from 'src/watchlist/watchlist.service';
import * as marketDataProviderTypes from 'src/market-data/market-data-provider.types';

@Injectable()
export class DailyPriceService implements OnModuleInit {
  private readonly logger = new Logger(DailyPriceService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(marketDataProviderTypes.Symbol_marketDataProvider)
    private readonly marketData: marketDataProviderTypes.MarketDataProvider,
    private readonly watchlist: WatchlistService,
  ) {}

  async onModuleInit() {
    this.logger.log('Verificando histórico dos preços.');
    await this.seedHistoricalPrices();
  }

  async seedHistoricalPrices() {
    const tickers = await this.watchlist.getActiveTickers();

    for (const ticker of tickers) {
      try {
        const count = await this.prisma.dailyPrice.count({
          where: { ticker },
        });

        if (count >= 20) {
          this.logger.log(`${ticker} Ok.`);
          continue;
        }

        this.logger.log(`${ticker} tem ${count}, buscando historico...`);

        await this.prisma.dailyPrice.deleteMany({ where: { ticker } });

        const candles = await this.marketData.getHistory(ticker, 25);

        await this.prisma.dailyPrice.createMany({
          data: candles.map((c) => ({
            ticker: c.symbol,
            date: c.date,
            open: c.open,
            high: c.high,
            close: c.close,
            low: c.low,
            volume: c.volume,
            source: 'yahoo-finance',
          })),
        });

        this.logger.log(`Candles de ${ticker} inseridos.`);
      } catch (error) {
        this.logger.error(`Erro no ${ticker} => ${error}`);
      }
      this.logger.log('Historico concluído.');
    }
  }
}
