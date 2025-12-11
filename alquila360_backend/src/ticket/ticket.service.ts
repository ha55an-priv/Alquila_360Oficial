import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import moment from 'moment';
import { Ticket, TicketStatus } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/ticket-photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddMultiplePhotosDto } from './dto/add-photo.dto';
import { RateTicketDto } from './dto/rate-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { AlertService } from 'src/alert/alert.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketPhoto) private photoRepo: Repository<TicketPhoto>,
    @InjectRepository(Problema) private problemaRepo: Repository<Problema>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(forwardRef(() => AlertService)) private alertsService: AlertService,
  ) {}

  // =====================
  // CREATE TICKET
  // =====================
  async create(createDto: CreateTicketDto) {
    const ticket = this.ticketRepo.create({
      idPropiedad: createDto.idPropiedad,
      idInquilino: createDto.idInquilino,
      descripcion: createDto.descripcion ?? null,
      fechaReporte: createDto.fechaReporte ? new Date(createDto.fechaReporte) : new Date(),
      prioridad: createDto.prioridad ?? undefined,
      estado: TicketStatus.SOLICITADO,
    });

    if (createDto.problemaIds?.length) {
      const problemas = await this.problemaRepo.find({ where: { idProblema: In(createDto.problemaIds) } });
      ticket.problemas = problemas;
    }

    const saved = await this.ticketRepo.save(ticket);

    if (createDto.fotoUrls?.length) {
      const fotos = createDto.fotoUrls.map(url =>
        this.photoRepo.create({ idTicket: saved.idTicket, url })
      );
      await this.photoRepo.save(fotos);
    }

    // Alert (best-effort)
    try { await this.alertsService.createNewTicketAlert(saved); } catch {}

    return this.findOne(saved.idTicket);
  }

  // =====================
  // FIND ALL
  // =====================
  async findAll(
    page = 1,
    limit = 10,
    sort?: string,
    order: 'ASC' | 'DESC' = 'DESC',
    filterDto?: FilterTicketDto,
  ) {
    const qb = this.ticketRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.problemas', 'p')
      .leftJoinAndSelect('t.fotos', 'f')
      .leftJoinAndSelect('t.tecnicosAsignados', 'tec')
      .leftJoinAndSelect('t.propiedad', 'propiedad')
      .leftJoinAndSelect('t.inquilino', 'inquilino');

    if (filterDto?.idPropiedad) qb.andWhere('t.idPropiedad = :idPropiedad', { idPropiedad: filterDto.idPropiedad });
    if (filterDto?.idInquilino) qb.andWhere('t.idInquilino = :idInquilino', { idInquilino: filterDto.idInquilino });
    if (filterDto?.estado) qb.andWhere('t.estado = :estado', { estado: filterDto.estado });
    if (filterDto?.prioridad) qb.andWhere('t.prioridad = :prioridad', { prioridad: filterDto.prioridad });
    if (filterDto?.idTecnico) qb.innerJoin('t.tecnicosAsignados', 'tecFilter').andWhere('tecFilter.ci = :idTecnico', { idTecnico: filterDto.idTecnico });
    if (filterDto?.idProblema) qb.innerJoin('t.problemas', 'pFilter').andWhere('pFilter.idProblema = :idProblema', { idProblema: filterDto.idProblema });

    if (filterDto?.fechaReporteDesde && filterDto?.fechaReporteHasta) {
      qb.andWhere('t.fechaReporte BETWEEN :desde AND :hasta', { desde: new Date(filterDto.fechaReporteDesde), hasta: new Date(filterDto.fechaReporteHasta) });
    } else if (filterDto?.fechaReporteDesde) {
      qb.andWhere('t.fechaReporte >= :desde', { desde: new Date(filterDto.fechaReporteDesde) });
    } else if (filterDto?.fechaReporteHasta) {
      qb.andWhere('t.fechaReporte <= :hasta', { hasta: new Date(filterDto.fechaReporteHasta) });
    }

    if (sort) qb.orderBy(`t.${sort}`, order);
    else qb.orderBy('t.fechaReporte', 'DESC');

    const total = await qb.getCount();
    const tickets = await qb.skip((page - 1) * limit).take(limit).getMany();

    const ticketsWithStats = tickets.map(t => {
      const now = moment();
      const fechaReporte = moment(t.fechaReporte);
      return {
        ...t,
        estadisticas: {
          tiempoResolucionHoras: t.fechaCierre ? moment(t.fechaCierre).diff(fechaReporte, 'hours') : null,
          tiempoTranscurridoHoras: now.diff(fechaReporte, 'hours'),
          asignado: t.tecnicosAsignados?.length > 0,
          tieneFotos: t.fotos?.length > 0,
          calificado: t.calificacionTecnico != null,
          diasAbierto: now.diff(fechaReporte, 'days'),
        },
      };
    });

    return {
      tickets: ticketsWithStats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: await this.getStats(filterDto),
    };
  }

  // =====================
  // FIND ONE
  // =====================
  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
      relations: ['propiedad', 'inquilino', 'tecnicosAsignados', 'problemas', 'fotos'],
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    const fechaReporte = moment(ticket.fechaReporte);
    const now = moment();
    (ticket as any).estadisticas = {
      tiempoResolucionHoras: ticket.fechaCierre ? moment(ticket.fechaCierre).diff(fechaReporte, 'hours') : null,
      tiempoTranscurridoHoras: now.diff(fechaReporte, 'hours'),
      asignado: ticket.tecnicosAsignados?.length > 0,
      tieneFotos: ticket.fotos?.length > 0,
      calificado: ticket.calificacionTecnico != null,
      diasAbierto: now.diff(fechaReporte, 'days'),
    };
    return ticket;
  }

  // =====================
  // UPDATE
  // =====================
  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    if (dto.descripcion !== undefined) ticket.descripcion = dto.descripcion;
    if (dto.estado !== undefined) ticket.estado = dto.estado as TicketStatus;
    if (dto.prioridad !== undefined) ticket.prioridad = dto.prioridad;
    if (dto.fechaCierre !== undefined) ticket.fechaCierre = dto.fechaCierre ? new Date(dto.fechaCierre) : null;

    if (dto.problemaIds?.length) {
      const problemas = await this.problemaRepo.find({ where: { idProblema: In(dto.problemaIds) } });
      ticket.problemas = problemas;
    }

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // =====================
  // REMOVE
  // =====================
  async remove(id: number) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    if (ticket.estado !== TicketStatus.SOLICITADO) {
      throw new BadRequestException('Solo se pueden eliminar tickets en estado SOLICITADO');
    }
    await this.ticketRepo.remove(ticket);
    return { message: 'Ticket eliminado correctamente' };
  }

  // =====================
  // ASSIGN TECHNICIANS
  // =====================
  async assignTechnicians(id: number, dto: AssignTechnicianDto) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }, relations: ['tecnicosAsignados'] });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    const tecnicos = await this.userRepo.find({ where: { ci: In(dto.tecnicosIds || []) } });
    if (!tecnicos.length) throw new NotFoundException('Técnicos no encontrados');

    ticket.tecnicosAsignados = [...(ticket.tecnicosAsignados || []), ...tecnicos];

    if (ticket.estado === TicketStatus.SOLICITADO) ticket.estado = TicketStatus.PROCESADO;

    const updated = await this.ticketRepo.save(ticket);

    try { await this.alertsService.createTechnicianAssignedAlert(updated, tecnicos); } catch {}

    return this.findOne(updated.idTicket);
  }

  // =====================
  // UPDATE STATUS
  // =====================
  async updateStatus(id: number, dto: UpdateStatusDto) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = dto.estado;
    if ((dto.estado === TicketStatus.FINALIZADO || dto.estado === TicketStatus.CANCELADO) && !ticket.fechaCierre) ticket.fechaCierre = new Date();

    const updated = await this.ticketRepo.save(ticket);

    try { await this.alertsService.createTicketStatusChangeAlert(updated, dto.comentarios); } catch {}

    return this.findOne(updated.idTicket);
  }

  // =====================
  // ADD PHOTOS
  // =====================
  async addPhotos(id: number, dto: AddMultiplePhotosDto) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    const photos = dto.fotos.map(p => this.photoRepo.create({ idTicket: id, url: p.url, filename: p.filename, publicId: p.publicId }));
    await this.photoRepo.save(photos);
    return this.findOne(id);
  }

  // =====================
  // RATE TICKET
  // =====================
  async rateTicket(id: number, dto: RateTicketDto) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id } });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    if (ticket.estado !== TicketStatus.FINALIZADO) throw new BadRequestException('Solo se pueden calificar tickets finalizados');

    ticket.calificacionTecnico = dto.calificacion;
    ticket.comentarioCalificacion = dto.comentarios ?? null;
    await this.ticketRepo.save(ticket);

    return this.findOne(id);
  }

  // =====================
  // FIND BY TECHNICIAN
  // =====================
  async findByTechnician(idTecnico: number, page = 1, limit = 10, sort?: string, order: 'ASC' | 'DESC' = 'DESC', filterDto?: FilterTicketDto) {
    const qb = this.ticketRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.propiedad', 'propiedad')
      .leftJoinAndSelect('t.fotos', 'f')
      .leftJoinAndSelect('t.tecnicosAsignados', 'tec')
      .where('tec.ci = :idTecnico', { idTecnico });

    if (filterDto?.estado) qb.andWhere('t.estado = :estado', { estado: filterDto.estado });
    if (sort) qb.orderBy(`t.${sort}`, order);
    else qb.orderBy('t.fechaReporte', 'DESC');

    const total = await qb.getCount();
    const tickets = await qb.skip((page - 1) * limit).take(limit).getMany();

    return {
      tickets: tickets.map(t => {
        const fechaReporte = moment(t.fechaReporte);
        return {
          ...t,
          estadisticas: {
            tiempoResolucionHoras: t.fechaCierre ? moment(t.fechaCierre).diff(fechaReporte, 'hours') : null,
            tiempoTranscurridoHoras: moment().diff(fechaReporte, 'hours'),
            asignado: t.tecnicosAsignados?.length > 0,
            tieneFotos: t.fotos?.length > 0,
            calificado: t.calificacionTecnico != null,
            diasAbierto: moment().diff(fechaReporte, 'days'),
          },
        };
      }),
      total,
      page,
      limit,
    };
  }

  // =====================
  // STATS
  // =====================
  async getStats(filterDto?: FilterTicketDto) {
    const byStatus = await this.getStatsByStatus();
    const byPriority = await this.getStatsByPriority();
    const sinAsignar = await this.ticketRepo.createQueryBuilder('t')
      .leftJoin('t.tecnicosAsignados', 'tec')
      .where('tec.ci IS NULL')
      .getCount();

    return {
      total: await this.ticketRepo.count(),
      porEstado: byStatus,
      porPrioridad: byPriority,
      sinAsignar,
    };
  }

  private async getStatsByStatus() {
    const rows = await this.ticketRepo.createQueryBuilder('t')
      .select('t.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .groupBy('t.estado')
      .getRawMany();
    return rows.reduce((acc, r) => ({ ...acc, [r.estado]: Number(r.total) }), {});
  }

  private async getStatsByPriority() {
    const rows = await this.ticketRepo.createQueryBuilder('t')
      .select('t.prioridad', 'prioridad')
      .addSelect('COUNT(*)', 'total')
      .groupBy('t.prioridad')
      .getRawMany();
    return rows.reduce((acc, r) => ({ ...acc, [r.prioridad]: Number(r.total) }), {});
  }
}