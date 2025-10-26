import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMovimientoDto } from './create-movimiento.dto';

export class CreateMovimientosArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMovimientoDto)
  movimientos: CreateMovimientoDto[];
}

