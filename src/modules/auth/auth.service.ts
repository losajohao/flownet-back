import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { UsuarioResponse } from '../usuarios/interfaces/usuario-response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(loginDto: LoginDto): Promise<{ usuario: UsuarioResponse }> {
    // Buscar usuario por email
    const usuario = await this.usuariosService.findByEmail(loginDto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.pwd, usuario.pwd);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retornar usuario sin la contraseña
    const { pwd, ...usuarioSinPassword } = usuario;

    return {
      usuario: usuarioSinPassword,
    };
  }
}

