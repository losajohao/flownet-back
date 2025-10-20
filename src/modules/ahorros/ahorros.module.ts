import { Module } from '@nestjs/common';
import { AhorrosController } from './ahorros.controller';
import { AhorrosService } from './ahorros.service';
import { AhorrosRepository } from './ahorros.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AhorrosController],
  providers: [AhorrosService, AhorrosRepository],
  exports: [AhorrosService, AhorrosRepository],
})
export class AhorrosModule {}

