import { Module } from '@nestjs/common';
import { YahooFinanceProvider } from './providers/yahoo-finance.provider';
import { Symbol_marketDataProvider } from './market-data-provider.types';

@Module({
  providers: [
    {
      provide: Symbol_marketDataProvider,
      useClass: YahooFinanceProvider,
    },
  ],
  exports: [Symbol_marketDataProvider],
})
export class MarketDataModule {}
