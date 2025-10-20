import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Movimiento } from './movimientos.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Injectable()
export class MovimientosRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos ORDER BY fecha_hora DESC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Movimiento | null> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByNegocio(negocioId: number): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE negocio_id = $1 ORDER BY fecha_hora DESC',
      [negocioId],
    );
    return result.rows;
  }

  async findByNegocioYProducto(negocioId: number, productoId: number): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE negocio_id = $1 AND producto_id = $2 ORDER BY fecha_hora ASC',
      [negocioId, productoId],
    );
    return result.rows;
  }

  async findByNegocioYTipo(negocioId: number, tipo_movimiento: 'entrada' | 'salida'): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE negocio_id = $1 AND tipo_movimiento = $2 ORDER BY fecha_hora DESC',
      [negocioId, tipo_movimiento],
    );
    return result.rows;
  }

  async findByNegocioYRango(negocioId: number, fechaInicio: string, fechaFin: string): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE negocio_id = $1 AND fecha_hora >= $2 AND fecha_hora <= $3 ORDER BY fecha_hora ASC',
      [negocioId, fechaInicio, fechaFin],
    );
    return result.rows;
  }

  async createMovimiento(dto: CreateMovimientoDto): Promise<Movimiento> {
    const result = await this.pool.query(
      `INSERT INTO movimientos (negocio_id, producto_id, descripcion, tipo_movimiento, cantidad, precio_unitario, monto)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [dto.negocio_id, dto.producto_id, dto.descripcion, dto.tipo_movimiento, dto.cantidad, dto.precio_unitario, dto.monto],
    );
    return result.rows[0];
  }

  async updateMovimiento(id: number, dto: UpdateMovimientoDto): Promise<Movimiento> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.negocio_id !== undefined) {
      fields.push(`negocio_id = $${paramCount++}`);
      values.push(dto.negocio_id);
    }
    if (dto.producto_id !== undefined) {
      fields.push(`producto_id = $${paramCount++}`);
      values.push(dto.producto_id);
    }
    if (dto.descripcion !== undefined) {
      fields.push(`descripcion = $${paramCount++}`);
      values.push(dto.descripcion);
    }
    if (dto.tipo_movimiento !== undefined) {
      fields.push(`tipo_movimiento = $${paramCount++}`);
      values.push(dto.tipo_movimiento);
    }
    if (dto.cantidad !== undefined) {
      fields.push(`cantidad = $${paramCount++}`);
      values.push(dto.cantidad);
    }
    if (dto.precio_unitario !== undefined) {
      fields.push(`precio_unitario = $${paramCount++}`);
      values.push(dto.precio_unitario);
    }
    if (dto.monto !== undefined) {
      fields.push(`monto = $${paramCount++}`);
      values.push(dto.monto);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE movimientos SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async deleteMovimiento(id: number): Promise<void> {
    await this.pool.query('DELETE FROM movimientos WHERE id = $1', [id]);
  }

  async getKardexByNegocio(negocioId: number): Promise<Movimiento[]> {
    const result = await this.pool.query(
      'SELECT * FROM movimientos WHERE negocio_id = $1 ORDER BY fecha_hora ASC',
      [negocioId],
    );
    return result.rows;
  }
}

