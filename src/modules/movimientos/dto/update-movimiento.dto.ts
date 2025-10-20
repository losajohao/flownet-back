import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateMovimientoDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  negocio_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  producto_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  tipo_movimiento?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidad?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  precio_unitario?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  monto?: number;
}

