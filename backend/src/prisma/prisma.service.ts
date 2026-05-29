import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.seed();
  }

  enableShutdownHooks(app: INestApplication): void {
    process.on('beforeExit', () => {
      void app.close();
    });
  }

  private async seed() {
    const count = await this.watchlist.count();
    if (count > 0) return;

    const tickers = [
      'ABEV3.SA',
      'ANIM3.SA',
      'ASAI3.SA',
      'AURE3.SA',
      'B3SA3.SA',
      'BBAS3.SA',
      'BBDC4.SA',
      'BBSE3.SA',
      'BEEF3.SA',
      'BRAV3.SA',
      'CEAB3.SA',
      'CMIG4.SA',
      'CMIN3.SA',
      'COGN3.SA',
      'CPLE3.SA',
      'CSAN3.SA',
      'CSNA3.SA',
      'CVCB3.SA',
      'CXSE3.SA',
      'CYRE3.SA',
      'DIRR3.SA',
      'DXCO3.SA',
      'ECOR3.SA',
      'EMBJ3.SA',
      'ENEV3.SA',
      'ENGI4.SA',
      'EQTL3.SA',
      'FLRY3.SA',
      'GMAT3.SA',
      'ITSA4.SA',
      'ITUB4.SA',
      'KLBN4.SA',
      'MGLU3.SA',
      'MOTV3.SA',
      'MRVE3.SA',
      'MULT3.SA',
      'NATU3.SA',
      'PCAR3.SA',
      'PGMN3.SA',
      'PETR4.SA',
      'PRIO3.SA',
      'QUAL3.SA',
      'RADL3.SA',
      'RAIL3.SA',
      'RAIZ4.SA',
      'RDOR3.SA',
      'RECV3.SA',
      'SANB4.SA',
      'SAUD3.SA',
      'SUZB3.SA',
      'TIMS3.SA',
      'UGPA3.SA',
      'VALE3.SA',
      'VAMO3.SA',
      'VBBR3.SA',
      'VIVT3.SA',
      'WEGE3.SA',
    ];

    await this.watchlist.createMany({
      data: tickers.map((ticker) => ({ ticker })),
    });
  }
}
