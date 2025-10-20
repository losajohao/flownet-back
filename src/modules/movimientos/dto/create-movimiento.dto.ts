import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateMovimientoDto {
  @IsNumber()
  @IsPositive()
  negocio_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  producto_id?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsString()
  tipo_movimiento: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precio_unitario: number;

  @IsNumber()
  @IsPositive()
  monto: number;
}

