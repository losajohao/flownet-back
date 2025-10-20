import { IsString, IsEmail, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  pwd: string;

  @IsNumber()
  @IsPositive()
  negocio_id: number;
}

