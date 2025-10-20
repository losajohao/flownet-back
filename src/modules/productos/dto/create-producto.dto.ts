import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsNumber()
  @IsPositive()
  categoria_id: number;

  @IsString()
  nombre: string;
}

