import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [WatchlistService],
  exports: [WatchlistService],
})
export class WatchlistModule {}
