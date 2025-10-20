import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AhorrosRepository } from './ahorros.repository';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { UpdateAhorroDto } from './dto/update-ahorro.dto';
import { Ahorro } from './ahorros.entity';
import { AhorroResumen, AhorroHistorial, AhorroDetalle } from './interfaces/ahorro-resumen.interface';

@Injectable()
export class AhorrosService {
  constructor(private readonly ahorrosRepository: AhorrosRepository) {}

  async findAll(): Promise<Ahorro[]> {
    return this.ahorrosRepository.findAll();
  }

  async findById(id: number): Promise<Ahorro> {
    const ahorro = await this.ahorrosRepository.findById(id);
    if (!ahorro) {
      throw new NotFoundException(`Ahorro con ID ${id} no encontrado`);
    }
    return ahorro;
  }

  async findByUsuario(usuarioId: number): Promise<Ahorro[]> {
    return this.ahorrosRepository.findByUsuario(usuarioId);
  }

  async findByUsuarioYTipo(usuarioId: number, tipo_movimiento: 'deposito' | 'retiro'): Promise<Ahorro[]> {
    return this.ahorrosRepository.findByUsuarioYTipo(usuarioId, tipo_movimiento);
  }

  async findByUsuarioYRango(usuarioId: number, fechaInicio: string, fechaFin: string): Promise<Ahorro[]> {
    return this.ahorrosRepository.findByUsuarioYRango(usuarioId, fechaInicio, fechaFin);
  }

  async create(dto: CreateAhorroDto): Promise<Ahorro> {
    // Validar que el retiro no deje saldo negativo
    if (dto.tipo_movimiento === 'retiro') {
      const saldoActual = await this.getSaldoByUsuario(dto.usuario_id);
      if (saldoActual.saldo_actual < dto.monto) {
        throw new BadRequestException(
          `Saldo insuficiente. Saldo actual: ${saldoActual.saldo_actual}, Monto a retirar: ${dto.monto}`
        );
      }
    }

    return this.ahorrosRepository.createAhorro(dto);
  }

  async update(id: number, dto: UpdateAhorroDto): Promise<Ahorro> {
    await this.findById(id);
    
    // Si se está actualizando el monto o tipo, validar saldo
    if (dto.tipo_movimiento === 'retiro' && dto.monto !== undefined && dto.usuario_id) {
      const saldoActual = await this.getSaldoByUsuario(dto.usuario_id);
      if (saldoActual.saldo_actual < dto.monto) {
        throw new BadRequestException(
          `Saldo insuficiente. Saldo actual: ${saldoActual.saldo_actual}, Monto a retirar: ${dto.monto}`
        );
      }
    }

    return this.ahorrosRepository.updateAhorro(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.ahorrosRepository.deleteAhorro(id);
  }

  async getSaldoByUsuario(usuarioId: number): Promise<AhorroResumen> {
    const ahorros = await this.ahorrosRepository.findByUsuario(usuarioId);
    
    let totalDepositos = 0;
    let totalRetiros = 0;

    ahorros.forEach((ahorro) => {
      if (ahorro.tipo_movimiento === 'deposito') {
        totalDepositos += ahorro.monto;
      } else {
        totalRetiros += ahorro.monto;
      }
    });

    return {
      usuario_id: usuarioId,
      saldo_actual: totalDepositos - totalRetiros,
      total_depositos: totalDepositos,
      total_retiros: totalRetiros,
      cantidad_movimientos: ahorros.length,
    };
  }

  async getHistorialByUsuario(usuarioId: number): Promise<AhorroHistorial> {
    const ahorros = await this.ahorrosRepository.getHistorialByUsuario(usuarioId);
    
    let saldoAcumulado = 0;
    let totalDepositos = 0;
    let totalRetiros = 0;

    const movimientos: AhorroDetalle[] = ahorros.map((ahorro) => {
      if (ahorro.tipo_movimiento === 'deposito') {
        saldoAcumulado += ahorro.monto;
        totalDepositos += ahorro.monto;
      } else {
        saldoAcumulado -= ahorro.monto;
        totalRetiros += ahorro.monto;
      }

      return {
        id: ahorro.id,
        fecha: ahorro.fecha_hora,
        tipo: ahorro.tipo_movimiento as 'deposito' | 'retiro',
        monto: ahorro.monto,
        saldo_acumulado: saldoAcumulado,
      };
    });

    return {
      usuario_id: usuarioId,
      saldo_actual: saldoAcumulado,
      total_depositos: totalDepositos,
      total_retiros: totalRetiros,
      movimientos,
    };
  }
}

