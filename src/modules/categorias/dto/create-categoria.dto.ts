import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateCategoriaDto {
  @IsNumber()
  @IsPositive()
  negocio_id: number;

  @IsString()
  nombre: string;
}

