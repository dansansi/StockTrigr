import { Module } from '@nestjs/common';
import { IntradayScanJob } from './intraday-scan.job';
import { DailyCloseJob } from './daily-close.job';
import { MarketDataModule } from 'src/market-data/market-data.module';
import { DailyPriceModule } from 'src/daily-price/daily-price.module';
import { IndicatorModule } from 'src/indicators/indicators.module';
import { WatchlistModule } from 'src/watchlist/watchlist.module';
import { AlertModule } from 'src/alert/alert.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    MarketDataModule,
    WatchlistModule,
    DailyPriceModule,
    IndicatorModule,
    AlertModule,
    PrismaModule,
  ],
  providers: [IntradayScanJob, DailyCloseJob],
})
export class JobsModule {}
