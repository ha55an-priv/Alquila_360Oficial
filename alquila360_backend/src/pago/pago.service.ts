// src/pago/pago.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';
import { PagoAlquiler, EstadoCuota } from '../entity/pago_alquiler.entity';
import { PagoTecnico, PagoTecnicoEstado } from '../entity/pagoTecnico.entity';
import { CreatePaymentDto } from './dto/create-pago.dto';
import { RegisterPaymentDto } from './dto/register-pago.dto';
import { FilterPaymentDto } from './dto/filter-pago.dto';
import { UpdatePaymentDto } from './dto/update-pago.dto';
import { RegisterPagoTecnicoDto } from './dto/register-pago-tecnico.dto';
import { CreatePagoTecnicoDto } from './dto/create-pago-tecnico.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PagoAlquiler) private readonly alquilerRepo: Repository<PagoAlquiler>,
    @InjectRepository(PagoTecnico) private readonly tecnicoRepo: Repository<PagoTecnico>,
  ) {}

  // ===== PagoAlquiler =====
  async createAlquiler(dto: CreatePaymentDto) {
    const pago = this.alquilerRepo.create({
      ...dto,
      fechaVencimiento: new Date(dto.fechaVencimiento), // CORREGIDO: fechaVencimiento en vez de fecha
      estado: EstadoCuota.PENDIENTE,
    });
    return this.alquilerRepo.save(pago);
  }

  async registerAlquiler(idPago: number, dto: RegisterPaymentDto) {
    const pago = await this.alquilerRepo.findOne({ where: { idPago } });
    if (!pago) throw new NotFoundException('Pago de alquiler no encontrado');

    Object.assign(pago, {
      metodoDePago: dto.metodoDePago,
      motivo: dto.motivo,
      estado: EstadoCuota.PAGADO,
      fechaPago: new Date(dto.fechaPago), // agregada fechaPago
      montoTotal: dto.montoPagado?.toString() || pago.montoTotal,
    });

    return this.alquilerRepo.save(pago);
  }

  async findAllAlquiler(
    page = 1,
    limit = 10,
    sort: string = 'fechaVencimiento',
    order: 'ASC' | 'DESC' = 'DESC',
    filter?: FilterPaymentDto,
  ) {
    const where: any = {};

    if (filter?.estado) where.estado = In(filter.estado);
    if (filter?.fechaDesde && filter?.fechaHasta) {
      where.fechaVencimiento = Between(new Date(filter.fechaDesde), new Date(filter.fechaHasta));
    } else if (filter?.fechaDesde) {
      where.fechaVencimiento = MoreThanOrEqual(new Date(filter.fechaDesde));
    } else if (filter?.fechaHasta) {
      where.fechaVencimiento = LessThanOrEqual(new Date(filter.fechaHasta));
    }

    const [items, total] = await this.alquilerRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: order },
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneAlquiler(idPago: number) {
    const pago = await this.alquilerRepo.findOne({ where: { idPago } });
    if (!pago) throw new NotFoundException('Pago de alquiler no encontrado');
    return pago;
  }

  async updateAlquiler(idPago: number, dto: UpdatePaymentDto) {
    const pago = await this.findOneAlquiler(idPago);
    Object.assign(pago, dto);
    return this.alquilerRepo.save(pago);
  }

  async removeAlquiler(idPago: number) {
    const pago = await this.findOneAlquiler(idPago);
    return this.alquilerRepo.remove(pago);
  }

  // ===== PagoTecnico =====
  async createTecnico(dto: CreatePagoTecnicoDto) {
    const pago = this.tecnicoRepo.create({
      ...dto,
      fecha: new Date(dto.fecha),
      estado: PagoTecnicoEstado.PENDIENTE,
      monto: dto.monto?.toString() || null, // CORREGIDO: convertir a string
    });
    return this.tecnicoRepo.save(pago);
  }

  async registerTecnico(idTicket: number, fecha: string, dto: RegisterPagoTecnicoDto) {
    const pago = await this.tecnicoRepo.findOne({ where: { idTicket, fecha: new Date(fecha) } });
    if (!pago) throw new NotFoundException('Pago técnico no encontrado');

    Object.assign(pago, {
      metodoDePago: dto.metodoDePago,
      motivo: dto.motivo,
      estado: PagoTecnicoEstado.PAGADO,
      monto: dto.monto?.toString() || pago.monto, // CORREGIDO: convertir a string
    });

    return this.tecnicoRepo.save(pago);
  }

  async findAllTecnico(
    page = 1,
    limit = 10,
    sort: string = 'fecha',
    order: 'ASC' | 'DESC' = 'DESC',
    filter?: FilterPaymentDto, // usa FilterPaymentDto específico si quieres
  ) {
    const where: any = {};

    if (filter?.estado) where.estado = In(filter.estado);
    if (filter?.fechaDesde && filter?.fechaHasta) {
      where.fecha = Between(new Date(filter.fechaDesde), new Date(filter.fechaHasta));
    } else if (filter?.fechaDesde) {
      where.fecha = MoreThanOrEqual(new Date(filter.fechaDesde));
    } else if (filter?.fechaHasta) {
      where.fecha = LessThanOrEqual(new Date(filter.fechaHasta));
    }

    const [items, total] = await this.tecnicoRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { [sort]: order },
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneTecnico(idTicket: number, fecha: string) {
    const pago = await this.tecnicoRepo.findOne({ where: { idTicket, fecha: new Date(fecha) } });
    if (!pago) throw new NotFoundException('Pago técnico no encontrado');
    return pago;
  }

  async updateTecnico(idTicket: number, fecha: string, dto: RegisterPagoTecnicoDto) {
    const pago = await this.findOneTecnico(idTicket, fecha);
    Object.assign(pago, { ...dto, monto: dto.monto?.toString() || pago.monto });
    return this.tecnicoRepo.save(pago);
  }

  async removeTecnico(idTicket: number, fecha: string) {
    const pago = await this.findOneTecnico(idTicket, fecha);
    return this.tecnicoRepo.remove(pago);
  }
}