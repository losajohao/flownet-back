import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(loginDto: LoginDto) {
    const { email, pwd } = loginDto;

    // Buscar usuario por email
    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(pwd, usuario.pwd);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Retornar datos del usuario sin la contraseña
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      negocio_id: usuario.negocio_id,
      message: 'Inicio de sesión exitoso',
    };
  }
}

