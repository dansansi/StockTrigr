import { Module } from '@nestjs/common';
import { YahooFinanceProvider } from './providers/yahoo-finance.provider';
import { marketDataProvider } from './market-data-provider.types';

@Module({
  providers: [
    {
      provide: marketDataProvider,
      useClass: YahooFinanceProvider,
    },
  ],
  exports: [marketDataProvider],
})
export class MarketDataModule {}
