import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AlertService } from 'src/alert/alert.service';
import { DailyPriceService } from 'src/daily-price/daily-price.service';
import { IndicatorService } from 'src/indicators/indicators.service';
import * as marketDataProviderTypes from 'src/market-data/market-data-provider.types';
import { WatchlistService } from 'src/watchlist/watchlist.service';

@Injectable()
export class IntradayScanJob {
  private readonly logger = new Logger(IntradayScanJob.name);

  constructor(
    @Inject(marketDataProviderTypes.Symbol_marketDataProvider)
    private readonly marketData: marketDataProviderTypes.MarketDataProvider,
    private readonly watchlist: WatchlistService,
    private readonly indicator: IndicatorService,
    private readonly alert: AlertService,
    private readonly dailyPrice: DailyPriceService,
  ) {}

  @Cron('*/15 10-18 * * 1-5', { timeZone: 'America/Sao_Paulo' })
  async run() {
    const tickers = await this.watchlist.getActiveTickers();
    const quotes = await this.marketData.getQuote(tickers);

    for (const quote of quotes) {
      const { symbol, regularMarketPrice, regularMarketDayLow } = quote;

      const history = await this.dailyPrice.getLastN(symbol, 19);
      if (history.length < 19) {
        this.logger.warn(
          `${symbol}: histórico insuficiente, ${history.length} candles.`,
        );
        continue;
      }
      if (!regularMarketPrice) {
        this.logger.warn(`${symbol}: sem preço atual!`);
        continue;
      }

      const closes = [...history.map((c) => c.close), regularMarketPrice];

      const bb20 = this.indicator.calculateBB(closes, 2.0);
      const bbFibo = this.indicator.calculateBB(closes, 4.8);

      const checks: {
        triggerType: string;
        value: number | null;
        lower: number;
      }[] = [
        {
          triggerType: 'Valor abaixo da Banda',
          value: regularMarketPrice,
          lower: bb20.lower,
        },
        {
          triggerType: 'Valor abaixo da Banda',
          value: regularMarketDayLow,
          lower: bb20.lower,
        },
        {
          triggerType: 'Valor abaixo da Banda Fibo 3',
          value: regularMarketPrice,
          lower: bbFibo.lower,
        },
        {
          triggerType: 'Valor abaixo da Banda Fibo 3',
          value: regularMarketDayLow,
          lower: bbFibo.lower,
        },
      ];

      for (const check of checks) {
        if (check.value == null) continue;

        if (check.value <= check.lower) {
          const msg = `${symbol} - Gatilho: ${check.triggerType}\nValor: ${check.value?.toFixed(2)} -- Banda inferior: ${check.lower.toFixed(2)}`;
          await this.alert.sendAlert(symbol, check.triggerType, msg);
          break;
        }
      }
    }
  }
}
