import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateAhorroDto {
  @IsNumber()
  @IsPositive()
  usuario_id: number;

  @IsString()
  tipo_movimiento: string;

  @IsNumber()
  @IsPositive()
  monto: number;
}

