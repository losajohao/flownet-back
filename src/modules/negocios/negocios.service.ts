import { Injectable, NotFoundException } from '@nestjs/common';
import { NegociosRepository } from './negocios.repository';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { Negocio } from './negocios.entity';

@Injectable()
export class NegociosService {
  constructor(private readonly negociosRepository: NegociosRepository) {}

  async findAll(): Promise<Negocio[]> {
    return this.negociosRepository.findAll();
  }

  async findById(id: number): Promise<Negocio> {
    const negocio = await this.negociosRepository.findById(id);
    if (!negocio) {
      throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
    }
    return negocio;
  }

  async create(dto: CreateNegocioDto): Promise<Negocio> {
    return this.negociosRepository.createNegocio(dto);
  }

  async update(id: number, dto: UpdateNegocioDto): Promise<Negocio> {
    await this.findById(id);
    return this.negociosRepository.updateNegocio(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.negociosRepository.deleteNegocio(id);
  }
}

