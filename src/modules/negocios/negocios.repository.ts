import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Negocio } from './negocios.entity';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';

@Injectable()
export class NegociosRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Negocio[]> {
    const result = await this.pool.query(
      'SELECT * FROM negocios ORDER BY nombre ASC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Negocio | null> {
    const result = await this.pool.query(
      'SELECT * FROM negocios WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async createNegocio(dto: CreateNegocioDto): Promise<Negocio> {
    const result = await this.pool.query(
      'INSERT INTO negocios (nombre) VALUES ($1) RETURNING *',
      [dto.nombre],
    );
    return result.rows[0];
  }

  async updateNegocio(id: number, dto: UpdateNegocioDto): Promise<Negocio> {
    const result = await this.pool.query(
      'UPDATE negocios SET nombre = $1 WHERE id = $2 RETURNING *',
      [dto.nombre, id],
    );
    return result.rows[0];
  }

  async deleteNegocio(id: number): Promise<void> {
    await this.pool.query('DELETE FROM negocios WHERE id = $1', [id]);
  }
}

