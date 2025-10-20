import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosRepository } from './usuarios.repository';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Usuario } from './usuarios.entity';
import { UsuarioResponse } from './interfaces/usuario-response.interface';

@Injectable()
export class UsuariosService {
  constructor(private readonly usuariosRepository: UsuariosRepository) {}

  async findAll(): Promise<UsuarioResponse[]> {
    const usuarios = await this.usuariosRepository.findAll();
    return usuarios.map(this.sanitizeUsuario);
  }

  async findById(id: number): Promise<UsuarioResponse> {
    const usuario = await this.usuariosRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return this.sanitizeUsuario(usuario);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findByEmail(email);
  }

  async findByNegocio(negocioId: number): Promise<UsuarioResponse[]> {
    const usuarios = await this.usuariosRepository.findByNegocio(negocioId);
    return usuarios.map(this.sanitizeUsuario);
  }

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponse> {
    // Verificar si el email ya existe
    const existingUser = await this.usuariosRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.pwd, 10);

    const usuario = await this.usuariosRepository.createUsuario(dto, hashedPassword);
    return this.sanitizeUsuario(usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<UsuarioResponse> {
    await this.findById(id);

    // Si se está actualizando el email, verificar que no exista
    if (dto.email) {
      const existingUser = await this.usuariosRepository.findByEmail(dto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    const usuario = await this.usuariosRepository.updateUsuario(id, dto);
    return this.sanitizeUsuario(usuario);
  }

  async updatePassword(id: number, dto: UpdatePasswordDto): Promise<void> {
    const usuario = await this.usuariosRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(dto.current_password, usuario.pwd);
    if (!isValidPassword) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(dto.new_password, 10);
    await this.usuariosRepository.updatePassword(id, hashedPassword);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.usuariosRepository.deleteUsuario(id);
  }

  // Método privado para remover el password de la respuesta
  private sanitizeUsuario(usuario: Usuario): UsuarioResponse {
    const { pwd, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}

