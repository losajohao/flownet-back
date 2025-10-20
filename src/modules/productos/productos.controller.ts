import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get('negocio/:negocioId')
  findByNegocio(@Param('negocioId', ParseIntPipe) negocioId: number) {
    return this.productosService.findByNegocio(negocioId);
  }

  @Get('categoria/:categoriaId')
  findByCategoria(@Param('categoriaId', ParseIntPipe) categoriaId: number) {
    return this.productosService.findByCategoria(categoriaId);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findById(id);
  }

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.delete(id);
  }
}

