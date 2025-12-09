import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PagoTecnico,
  PagoTecnicoEstado,
} from '../entity/pagoTecnico.entity';
import { Ticket } from '../entity/ticket.entity';
import { User } from '../entity/user.entity';
import { CreatePagoTecnicoDto } from './dto/create-pago-tecnico.dto';
import { MarkPaidPagoTecnicoDto } from './dto/mark-paid-pago-tecnico.dto';

@Injectable()
export class PagosTecnicoService {
  constructor(
    @InjectRepository(PagoTecnico)
    private readonly pagoRepo: Repository<PagoTecnico>,
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // CREATE
  async create(dto: CreatePagoTecnicoDto) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: dto.idTicket },
      relations: ['tecnicosAsignados'],
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    let tecnico: User | null = null;

    if (dto.idTecnico) {
      tecnico = await this.userRepo.findOne({
        where: { ci: dto.idTecnico },
      });
      if (!tecnico) throw new NotFoundException('Técnico no encontrado');
    } else {
      if (!ticket.tecnicosAsignados || ticket.tecnicosAsignados.length === 0) {
        throw new BadRequestException(
          'El ticket no tiene técnico asignado y no se envió idTecnico',
        );
      }
      tecnico = ticket.tecnicosAsignados[0];
    }

    const pago = this.pagoRepo.create({
      idTicket: ticket.idTicket,
      fecha: dto.fecha ? new Date(dto.fecha) : new Date(),
      idTecnico: tecnico.ci,
      ticket,
      tecnico,
      motivo: dto.motivo ?? null,
      monto:
        dto.monto !== undefined && dto.monto !== null
          ? dto.monto.toFixed(2)
          : null,
      metodoDePago: dto.metodoDePago ?? null,
      estado: dto.estado ?? PagoTecnicoEstado.PENDIENTE,
    });

    await this.pagoRepo.save(pago);

    return this.pagoRepo.findOne({
      where: { idTicket: pago.idTicket, fecha: pago.fecha },
      relations: ['ticket', 'tecnico'],
    });
  }

  // MARCAR COMO PAGADO
  async markPaid(dto: MarkPaidPagoTecnicoDto) {
    const fecha = new Date(dto.fecha);

    const pago = await this.pagoRepo.findOne({
      where: { idTicket: dto.idTicket, fecha },
    });

    if (!pago) throw new NotFoundException('Pago no encontrado');

    pago.estado = PagoTecnicoEstado.PAGADO;
    if (dto.metodoDePago !== undefined) {
      pago.metodoDePago = dto.metodoDePago;
    }

    await this.pagoRepo.save(pago);

    return this.pagoRepo.findOne({
      where: { idTicket: pago.idTicket, fecha: pago.fecha },
      relations: ['ticket', 'tecnico'],
    });
  }

  // LISTAR TODOS
  async findAll() {
    return this.pagoRepo.find({
      relations: ['ticket', 'tecnico'],
      order: { fecha: 'DESC' },
    });
  }

  // LISTAR POR TÉCNICO
  async findByTechnician(idTecnico: number) {
    return this.pagoRepo.find({
      where: { idTecnico },
      relations: ['ticket', 'tecnico'],
      order: { fecha: 'DESC' },
    });
  }
}
