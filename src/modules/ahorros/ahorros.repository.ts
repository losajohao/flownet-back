import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Ahorro } from './ahorros.entity';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';

@Injectable()
export class AhorrosRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Ahorro[]> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros ORDER BY fecha_hora DESC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Ahorro | null> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByUsuario(usuarioId: number): Promise<Ahorro[]> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros WHERE usuario_id = $1 ORDER BY fecha_hora DESC',
      [usuarioId],
    );
    return result.rows;
  }

  async findByUsuarioYTipo(usuarioId: number, tipo_movimiento: 'deposito' | 'retiro'): Promise<Ahorro[]> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros WHERE usuario_id = $1 AND tipo_movimiento = $2 ORDER BY fecha_hora DESC',
      [usuarioId, tipo_movimiento],
    );
    return result.rows;
  }

  async findByUsuarioYRango(usuarioId: number, fechaInicio: string, fechaFin: string): Promise<Ahorro[]> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros WHERE usuario_id = $1 AND fecha_hora >= $2 AND fecha_hora <= $3 ORDER BY fecha_hora ASC',
      [usuarioId, fechaInicio, fechaFin],
    );
    return result.rows;
  }

  async createAhorro(dto: CreateAhorroDto): Promise<Ahorro> {
    const result = await this.pool.query(
      `INSERT INTO ahorros (usuario_id, tipo_movimiento, monto)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [dto.usuario_id, dto.tipo_movimiento, dto.monto],
    );
    return result.rows[0];
  }

  async updateAhorro(id: number, dto: UpdateAhorroDto): Promise<Ahorro> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.usuario_id !== undefined) {
      fields.push(`usuario_id = $${paramCount++}`);
      values.push(dto.usuario_id);
    }
    if (dto.tipo_movimiento !== undefined) {
      fields.push(`tipo_movimiento = $${paramCount++}`);
      values.push(dto.tipo_movimiento);
    }
    if (dto.monto !== undefined) {
      fields.push(`monto = $${paramCount++}`);
      values.push(dto.monto);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE ahorros SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async deleteAhorro(id: number): Promise<void> {
    await this.pool.query('DELETE FROM ahorros WHERE id = $1', [id]);
  }

  async getHistorialByUsuario(usuarioId: number): Promise<Ahorro[]> {
    const result = await this.pool.query(
      'SELECT * FROM ahorros WHERE usuario_id = $1 ORDER BY fecha_hora ASC',
      [usuarioId],
    );
    return result.rows;
  }
}

