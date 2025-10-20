import { Module } from '@nestjs/common';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { ProductosRepository } from './productos.repository';

@Module({
  imports: [],
  controllers: [ProductosController],
  providers: [ProductosService, ProductosRepository],
  exports: [ProductosService],
})
export class ProductosModule {}

