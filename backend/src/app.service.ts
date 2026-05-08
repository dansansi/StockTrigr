import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  status: 'ok';
  timezone: string;
  timestamp: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      timezone: process.env.TIMEZONE ?? 'America/Sao_Paulo',
      timestamp: new Date().toISOString(),
    };
  }
}
