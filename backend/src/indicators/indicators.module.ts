import { Module } from '@nestjs/common';
import { IndicatorService } from './indicators.service';

@Module({
  providers: [IndicatorService],
  exports: [IndicatorService],
})
export class IndicatorModule {}
