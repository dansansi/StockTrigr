import { Module } from '@nestjs/common';
import { DailyPriceService } from './daily-price.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MarketDataModule } from 'src/market-data/market-data.module';
import { WatchlistModule } from 'src/watchlist/watchlist.module';

@Module({
  imports: [PrismaModule, MarketDataModule, WatchlistModule],
  providers: [DailyPriceService],
  exports: [DailyPriceService],
})
export class DailyPriceModule {}
