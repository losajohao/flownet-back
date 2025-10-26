import { Injectable, NotFoundException } from '@nestjs/common';
import { MovimientosRepository } from './movimientos.repository';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Movimiento } from './movimientos.entity';
import { KardexResumen, KardexItem } from './interfaces/kardex.interface';

@Injectable()
export class MovimientosService {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async findAll(): Promise<Movimiento[]> {
    return this.movimientosRepository.findAll();
  }

  async findById(id: number): Promise<Movimiento> {
    const movimiento = await this.movimientosRepository.findById(id);
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return movimiento;
  }

  async findByNegocio(negocioId: number): Promise<Movimiento[]> {
    return this.movimientosRepository.findByNegocio(negocioId);
  }

  async findByNegocioYTipo(negocioId: number, tipo: 'entrada' | 'salida'): Promise<Movimiento[]> {
    return this.movimientosRepository.findByNegocioYTipo(negocioId, tipo);
  }

  async findByNegocioYRango(negocioId: number, fechaInicio: string, fechaFin: string): Promise<Movimiento[]> {
    return this.movimientosRepository.findByNegocioYRango(negocioId, fechaInicio, fechaFin);
  }

  async create(dto: CreateMovimientoDto): Promise<Movimiento> {
    return this.movimientosRepository.createMovimiento(dto);
  }

  async createMultiple(dtos: CreateMovimientoDto[]): Promise<Movimiento[]> {
    return this.movimientosRepository.createMultipleMovimientos(dtos);
  }

  async update(id: number, dto: UpdateMovimientoDto): Promise<Movimiento> {
    await this.findById(id);
    return this.movimientosRepository.updateMovimiento(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.movimientosRepository.deleteMovimiento(id);
  }

  async getKardexByNegocio(negocioId: number): Promise<KardexResumen> {
    const movimientos = await this.movimientosRepository.getKardexByNegocio(negocioId);
    
    let saldoAcumulado = 0;
    let totalEntradas = 0;
    let totalSalidas = 0;

    const kardexItems: KardexItem[] = movimientos.map((mov) => {
      const descripcion = mov.descripcion || `Producto ID: ${mov.producto_id}`;
      
      if (mov.tipo_movimiento === 'entrada') {
        saldoAcumulado += mov.monto;
        totalEntradas += mov.monto;
      } else {
        saldoAcumulado -= mov.monto;
        totalSalidas += mov.monto;
      }

      return {
        id: mov.id,
        fecha: mov.fecha_hora,
        tipo: mov.tipo_movimiento as 'entrada' | 'salida',
        descripcion,
        monto_unitario: mov.precio_unitario,
        cantidad: mov.cantidad,
        total: mov.monto,
        saldo: saldoAcumulado,
      };
    });

    return {
      total_entradas: totalEntradas,
      total_salidas: totalSalidas,
      saldo_global: saldoAcumulado,
      movimientos: kardexItems,
    };
  }

  async getSaldoByNegocio(negocioId: number): Promise<{ negocio_id: number; saldo: number; total_entradas: number; total_salidas: number }> {
    const movimientos = await this.movimientosRepository.getKardexByNegocio(negocioId);
    
    let totalEntradas = 0;
    let totalSalidas = 0;

    movimientos.forEach((mov) => {
      if (mov.tipo_movimiento === 'entrada') {
        totalEntradas += mov.monto;
      } else {
        totalSalidas += mov.monto;
      }
    });

    return {
      negocio_id: negocioId,
      saldo: totalEntradas - totalSalidas,
      total_entradas: totalEntradas,
      total_salidas: totalSalidas,
    };
  }

  async getKardexByNegocioYProducto(negocioId: number, productoId: number): Promise<KardexResumen> {
    const movimientos = await this.movimientosRepository.findByNegocioYProducto(negocioId, productoId);
    
    let saldoAcumulado = 0;
    let totalEntradas = 0;
    let totalSalidas = 0;

    const kardexItems: KardexItem[] = movimientos.map((mov) => {
      const descripcion = mov.descripcion || `Producto ID: ${mov.producto_id}`;
      
      if (mov.tipo_movimiento === 'entrada') {
        saldoAcumulado += mov.monto;
        totalEntradas += mov.monto;
      } else {
        saldoAcumulado -= mov.monto;
        totalSalidas += mov.monto;
      }

      return {
        id: mov.id,
        fecha: mov.fecha_hora,
        tipo: mov.tipo_movimiento as 'entrada' | 'salida',
        descripcion,
        monto_unitario: mov.precio_unitario,
        cantidad: mov.cantidad,
        total: mov.monto,
        saldo: saldoAcumulado,
      };
    });

    return {
      total_entradas: totalEntradas,
      total_salidas: totalSalidas,
      saldo_global: saldoAcumulado,
      movimientos: kardexItems,
    };
  }
}

