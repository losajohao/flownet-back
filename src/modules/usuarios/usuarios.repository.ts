import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../database/database.module';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async findAll(): Promise<Usuario[]> {
    const result = await this.pool.query(
      'SELECT * FROM usuarios ORDER BY nombre ASC',
    );
    return result.rows;
  }

  async findById(id: number): Promise<Usuario | null> {
    const result = await this.pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const result = await this.pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email],
    );
    return result.rows[0] || null;
  }

  async findByNegocio(negocioId: number): Promise<Usuario[]> {
    const result = await this.pool.query(
      'SELECT * FROM usuarios WHERE negocio_id = $1 ORDER BY nombre ASC',
      [negocioId],
    );
    return result.rows;
  }

  async createUsuario(dto: CreateUsuarioDto, hashedPassword: string): Promise<Usuario> {
    const result = await this.pool.query(
      `INSERT INTO usuarios (negocio_id, nombre, email, pwd)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        dto.negocio_id,
        dto.nombre,
        dto.email,
        hashedPassword,
      ],
    );
    return result.rows[0];
  }

  async updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
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
    if (dto.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(dto.email);
    }

    values.push(id);

    const result = await this.pool.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return result.rows[0];
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await this.pool.query(
      'UPDATE usuarios SET pwd = $1 WHERE id = $2',
      [hashedPassword, id],
    );
  }

  async deleteUsuario(id: number): Promise<void> {
    await this.pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }
}

