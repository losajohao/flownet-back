import { Module } from '@nestjs/common';
import { NegociosController } from './negocios.controller';
import { NegociosService } from './negocios.service';
import { NegociosRepository } from './negocios.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NegociosController],
  providers: [NegociosService, NegociosRepository],
  exports: [NegociosService, NegociosRepository],
})
export class NegociosModule {}

