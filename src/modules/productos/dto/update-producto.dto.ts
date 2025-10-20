import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoria_id?: number;

  @IsOptional()
  @IsString()
  nombre?: string;
}

