import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateCategoriaDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  negocio_id?: number;

  @IsOptional()
  @IsString()
  nombre?: string;
}

