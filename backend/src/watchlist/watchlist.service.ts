import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class WatchlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveTickers(): Promise<string[]> {
    const watchlist = await this.prisma.watchlist.findMany({
      where: { isActive: true },
      select: { ticker: true },
    });

    return watchlist.map((w) => w.ticker);
  }
}
