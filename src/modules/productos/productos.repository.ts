import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Producto } from './productos.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Producto[]> {
    const result = await this.pool.query(
      'SELECT * FROM productos ORDER BY id DESC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Producto | null> {
    const result = await this.pool.query(
      'SELECT * FROM productos WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByNegocio(negocioId: number): Promise<Producto[]> {
    const result = await this.pool.query(
      `SELECT p.* FROM productos p
       INNER JOIN categorias c ON p.categoria_id = c.id
       WHERE c.negocio_id = $1
       ORDER BY p.nombre ASC`,
      [negocioId],
    );
    return result.rows;
  }

  async findByCategoria(categoriaId: number): Promise<Producto[]> {
    const result = await this.pool.query(
      'SELECT * FROM productos WHERE categoria_id = $1 ORDER BY nombre ASC',
      [categoriaId],
    );
    return result.rows;
  }

  async createProducto(dto: CreateProductoDto): Promise<Producto> {
    const result = await this.pool.query(
      `INSERT INTO productos (categoria_id, nombre)
       VALUES ($1, $2)
       RETURNING *`,
      [dto.categoria_id, dto.nombre],
    );
    return result.rows[0];
  }

  async updateProducto(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.categoria_id !== undefined) {
      fields.push(`categoria_id = $${paramCount++}`);
      values.push(dto.categoria_id);
    }
    if (dto.nombre !== undefined) {
      fields.push(`nombre = $${paramCount++}`);
      values.push(dto.nombre);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async deleteProducto(id: number): Promise<void> {
    await this.pool.query('DELETE FROM productos WHERE id = $1', [id]);
  }
}

