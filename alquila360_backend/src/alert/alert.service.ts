import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta, EstadoAlerta, TipoAlerta } from '../entity/alerta.entity';
import { User } from '../entity/user.entity';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FilterAlertDto } from './dto/filter-alert.dto';
import { Ticket } from '../entity/ticket.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alerta) private alertRepo: Repository<Alerta>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createDto: CreateAlertDto) {
    const usuario = await this.userRepo.findOne({ where: { ci: createDto.idUsuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const alert = this.alertRepo.create({
      ...createDto,
      usuario,
      estado: createDto.estado ?? EstadoAlerta.PENDIENTE,
    });

    return this.alertRepo.save(alert);
  }

  async findAll(
    page = 1,
    limit = 10,
    sort: string = 'fechaCreacion',
    order: 'ASC' | 'DESC' = 'DESC',
    filterDto?: FilterAlertDto,
  ) {
    const qb = this.alertRepo.createQueryBuilder('a').leftJoinAndSelect('a.usuario', 'u');

    if (filterDto?.idUsuario) qb.andWhere('a.idUsuario = :idUsuario', { idUsuario: filterDto.idUsuario });
    if (filterDto?.tipo) qb.andWhere('a.tipo = :tipo', { tipo: filterDto.tipo });
    if (filterDto?.estado) qb.andWhere('a.estado = :estado', { estado: filterDto.estado });

    const total = await qb.getCount();
    const alerts = await qb
      .orderBy(`a.${sort}`, order)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      alerts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const alert = await this.alertRepo.findOne({ where: { idAlerta: id }, relations: ['usuario'] });
    if (!alert) throw new NotFoundException('Alerta no encontrada');
    return alert;
  }

  async update(id: number, dto: UpdateAlertDto) {
    const alert = await this.alertRepo.findOne({ where: { idAlerta: id } });
    if (!alert) throw new NotFoundException('Alerta no encontrada');

    Object.assign(alert, dto);

    if (dto.estado === EstadoAlerta.ENVIADA && !alert.fechaEnvio) alert.fechaEnvio = new Date();
    if (dto.estado === EstadoAlerta.LEIDA && !alert.fechaLectura) alert.fechaLectura = new Date();

    return this.alertRepo.save(alert);
  }

  async remove(id: number) {
    const alert = await this.alertRepo.findOne({ where: { idAlerta: id } });
    if (!alert) throw new NotFoundException('Alerta no encontrada');

    await this.alertRepo.remove(alert);
    return { message: 'Alerta eliminada correctamente' };
  }

  // Estadísticas por tipo y estado
  async getStats() {
    const byTipo = await this.alertRepo
      .createQueryBuilder('a')
      .select('a.tipo', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .groupBy('a.tipo')
      .getRawMany();

    const byEstado = await this.alertRepo
      .createQueryBuilder('a')
      .select('a.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .groupBy('a.estado')
      .getRawMany();

    return {
      total: await this.alertRepo.count(),
      porTipo: byTipo.reduce((acc, r) => ({ ...acc, [r.tipo]: Number(r.total) }), {}),
      porEstado: byEstado.reduce((acc, r) => ({ ...acc, [r.estado]: Number(r.total) }), {}),
    };
  }
  async createNewTicketAlert(ticket: Ticket) {
    if (!ticket.idInquilino) return; // No crear alerta si no hay usuario

    const alerta = this.alertRepo.create({
      idUsuario: ticket.idInquilino, // Usuario receptor de la alerta
      tipo: TipoAlerta.TICKET_NUEVO,
      titulo: `Nuevo ticket reportado (#${ticket.idTicket})`,
      mensaje: `Se ha creado un nuevo ticket con prioridad ${
        ticket.prioridad ?? 'NORMAL'
      }: ${ticket.descripcion ?? '-'}`,
      estado: EstadoAlerta.PENDIENTE,
      entidadRelacionada: 'Ticket',
      idEntidadRelacionada: ticket.idTicket,
    });

    return this.alertRepo.save(alerta);
  }
  async createTechnicianAssignedAlert(ticket: Ticket, tecnicos: User[]) {
    if (!tecnicos || tecnicos.length === 0) return;

    const alertas = tecnicos.map(tec =>
      this.alertRepo.create({
        idUsuario: tec.ci,
        tipo: TipoAlerta.TICKET_NUEVO,
        titulo: `Se te ha asignado un ticket (#${ticket.idTicket})`,
        mensaje: `Se te ha asignado el ticket con prioridad ${
          ticket.prioridad ?? 'NORMAL'
        }: ${ticket.descripcion ?? '-'}`,
        estado: EstadoAlerta.PENDIENTE,
        entidadRelacionada: 'Ticket',
        idEntidadRelacionada: ticket.idTicket,
      }),
    );

    return this.alertRepo.save(alertas);
  }

  // ============================================
  // CAMBIO DE ESTADO DE TICKET
  // ============================================
  async createTicketStatusChangeAlert(ticket: Ticket, comentarios?: string) {
    if (!ticket.idInquilino) return;

    const alerta = this.alertRepo.create({
      idUsuario: ticket.idInquilino,
      tipo: TipoAlerta.TICKET_NUEVO,
      titulo: `Estado del ticket actualizado (#${ticket.idTicket})`,
      mensaje: `El estado de tu ticket ha cambiado a ${ticket.estado}. ${
        comentarios ? 'Comentarios: ' + comentarios : ''
      }`,
      estado: EstadoAlerta.PENDIENTE,
      entidadRelacionada: 'Ticket',
      idEntidadRelacionada: ticket.idTicket,
    });

    return this.alertRepo.save(alerta);
  }
}
