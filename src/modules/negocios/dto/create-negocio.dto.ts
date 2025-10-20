import { IsString, MinLength } from 'class-validator';

export class CreateNegocioDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;
}

