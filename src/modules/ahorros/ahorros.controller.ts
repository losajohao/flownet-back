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
import { AhorrosService } from './ahorros.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';

@Controller('ahorros')
export class AhorrosController {
  constructor(private readonly ahorrosService: AhorrosService) {}

  @Get()
  findAll() {
    return this.ahorrosService.findAll();
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.ahorrosService.findByUsuario(usuarioId);
  }

  @Get('saldo/:usuarioId')
  getSaldoByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.ahorrosService.getSaldoByUsuario(usuarioId);
  }

  @Get('historial/:usuarioId')
  getHistorialByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.ahorrosService.getHistorialByUsuario(usuarioId);
  }

  @Get('usuario/:usuarioId/tipo/:tipo')
  findByUsuarioYTipo(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Param('tipo') tipo: 'deposito' | 'retiro',
  ) {
    return this.ahorrosService.findByUsuarioYTipo(usuarioId, tipo);
  }

  @Get('usuario/:usuarioId/rango')
  findByUsuarioYRango(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ahorrosService.findByUsuarioYRango(usuarioId, fechaInicio, fechaFin);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.ahorrosService.findById(id);
  }

  @Post()
  create(@Body() createAhorroDto: CreateAhorroDto) {
    return this.ahorrosService.create(createAhorroDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAhorroDto: UpdateAhorroDto,
  ) {
    return this.ahorrosService.update(id, updateAhorroDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.ahorrosService.delete(id);
  }
}

