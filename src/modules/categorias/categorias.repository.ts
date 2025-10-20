import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Categoria } from './categorias.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Categoria[]> {
    const result = await this.pool.query(
      'SELECT * FROM categorias ORDER BY nombre ASC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Categoria | null> {
    const result = await this.pool.query(
      'SELECT * FROM categorias WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByNegocio(negocioId: number): Promise<Categoria[]> {
    const result = await this.pool.query(
      'SELECT * FROM categorias WHERE negocio_id = $1 ORDER BY nombre ASC',
      [negocioId],
    );
    return result.rows;
  }

  async createCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    const result = await this.pool.query(
      `INSERT INTO categorias (negocio_id, nombre)
       VALUES ($1, $2)
       RETURNING *`,
      [dto.negocio_id, dto.nombre],
    );
    return result.rows[0];
  }

  async updateCategoria(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.negocio_id !== undefined) {
      fields.push(`negocio_id = $${paramCount++}`);
      values.push(dto.negocio_id);
    }
    if (dto.nombre !== undefined) {
      fields.push(`nombre = $${paramCount++}`);
      values.push(dto.nombre);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE categorias SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async deleteCategoria(id: number): Promise<void> {
    await this.pool.query('DELETE FROM categorias WHERE id = $1', [id]);
  }
}

