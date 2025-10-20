import { Module } from '@nestjs/common';
import { MovimientosController } from './movimientos.controller';
import { MovimientosService } from './movimientos.service';
import { MovimientosRepository } from './movimientos.repository';

@Module({
  imports: [],
  controllers: [MovimientosController],
  providers: [MovimientosService, MovimientosRepository],
  exports: [MovimientosService],
})
export class MovimientosModule {}

