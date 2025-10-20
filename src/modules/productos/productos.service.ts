import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductosRepository } from './productos.repository';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './productos.entity';

@Injectable()
export class ProductosService {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.findAll();
  }

  async findById(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findById(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async findByNegocio(negocioId: number): Promise<Producto[]> {
    return this.productosRepository.findByNegocio(negocioId);
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    return this.productosRepository.findByCategoria(categoriaId);
  }


  async create(dto: CreateProductoDto): Promise<Producto> {
    return this.productosRepository.createProducto(dto);
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    await this.findById(id);
    return this.productosRepository.updateProducto(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.productosRepository.deleteProducto(id);
  }
}

