import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateAhorroDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  usuario_id?: number;

  @IsOptional()
  @IsString()
  tipo_movimiento?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  monto?: number;
}

