import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriasRepository } from './categorias.repository';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './categorias.entity';

@Injectable()
export class CategoriasService {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.findAll();
  }

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findById(id);
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async findByNegocio(negocioId: number): Promise<Categoria[]> {
    return this.categoriasRepository.findByNegocio(negocioId);
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriasRepository.createCategoria(dto);
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    await this.findById(id);
    return this.categoriasRepository.updateCategoria(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.categoriasRepository.deleteCategoria(id);
  }
}

