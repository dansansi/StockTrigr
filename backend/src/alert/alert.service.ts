import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);

  constructor(private readonly prisma: PrismaService) {}

  async shouldAlert(ticker: string, triggerType: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.alertSent.findFirst({
      where: {
        ticker,
        triggerType,
        triggerDate: { gte: today },
      },
    });
    return !existing;
  }

  async sendAlert(
    ticker: string,
    triggerType: string,
    message: string,
  ): Promise<void> {
    const can = await this.shouldAlert(ticker, triggerType);
    if (!can) {
      this.logger.log(`${ticker} - ${triggerType} já disparado hoje.`);
      return;
    }

    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    await this.prisma.alertSent.create({
      data: {
        ticker,
        triggerType,
        triggerDate: new Date(),
      },
    });

    this.logger.log(`Alerta enviado de ${ticker}. ${triggerType}`);
  }
}
