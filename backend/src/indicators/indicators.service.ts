import { Injectable } from '@nestjs/common';

export interface BandResult {
  sma: number;
  upper: number;
  lower: number;
}

@Injectable()
export class IndicatorService {
  calculateBB(prices: number[], deviation: number): BandResult {
    const sma = prices!.reduce((sum, p) => sum + p, 0) / prices!.length;
    const variance =
      prices!.reduce((sum, p) => sum + Math.pow(p - sma, 2), 0) /
      prices!.length;
    const std = Math.sqrt(variance);

    return {
      sma,
      upper: sma + deviation * std,
      lower: sma - deviation * std,
    };
  }
}
