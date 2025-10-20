import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateNegocioDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre?: string;
}

