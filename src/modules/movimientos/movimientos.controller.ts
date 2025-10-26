import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { CreateMovimientosArrayDto } from './dto/create-movimientos-array.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get()
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get('negocio/:negocioId')
  findByNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.movimientosService.findByNegocio(negocioId);
  }

  @Get('kardex/:negocioId')
  getKardexByNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.movimientosService.getKardexByNegocio(negocioId);
  }

  @Get('kardex/:negocioId/saldo')
  getSaldoByNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.movimientosService.getSaldoByNegocio(negocioId);
  }

  @Get('kardex/:negocioId/producto/:productoId')
  getKardexByNegocioYProducto(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
  ) {
    return this.movimientosService.getKardexByNegocioYProducto(negocioId, productoId);
  }

  @Get('negocio/:negocioId/tipo/:tipo')
  findByNegocioYTipo(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('tipo') tipo: 'entrada' | 'salida',
  ) {
    return this.movimientosService.findByNegocioYTipo(negocioId, tipo);
  }

  @Get('negocio/:negocioId/rango')
  findByNegocioYRango(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.movimientosService.findByNegocioYRango(negocioId, fechaInicio, fechaFin);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.findById(id);
  }

  @Post()
  create(@Body() createMovimientosArrayDto: CreateMovimientosArrayDto) {
    return this.movimientosService.createMultiple(createMovimientosArrayDto.movimientos);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
  ) {
    return this.movimientosService.update(id, updateMovimientoDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosService.delete(id);
  }
}

