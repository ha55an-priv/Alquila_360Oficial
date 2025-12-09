// src/ticket/ticket-service.ts
import { Express } from 'express';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
} from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
// Si no usas esto, puedes borrarlo
// import { extractFileUrl, extractFileName } from './file-utils';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketPhoto)
    private photoRepo: Repository<TicketPhoto>,
    @InjectRepository(Problema)
    private problemaRepo: Repository<Problema>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  // ============================
  // CREAR TICKET
  // ============================
  async create(createDto: any) {
    const prioridad = this.normalizePriority(createDto.prioridad);

    const ticket = this.ticketRepo.create({
      idPropiedad: createDto.idPropiedad,
      idInquilino: createDto.idInquilino,
      descripcion: createDto.descripcion ?? null,
      fechaReporte: createDto.fechaReporte
        ? new Date(createDto.fechaReporte)
        : new Date(),
      estado: TicketStatus.SOLICITADO,
      prioridad,
    });

    if (createDto.problemas && createDto.problemas.length) {
      const problemas = await this.problemaRepo.find({
        where: { idProblema: In(createDto.problemas) },
      });
      // @ts-ignore
      ticket.problemas = problemas;
    }

    return this.ticketRepo.save(ticket);
  }

  // ============================
  // LISTAR TICKETS SEGÚN ROL
  // ============================
  async findAllForUser(user: User) {
    const roleNames = (user.roles || []).map((r) =>
      r.nombre?.toLowerCase(),
    );

    // ADMIN ve todos
    if (roleNames.includes('administrador') || roleNames.includes('admin')) {
      const tickets = await this.ticketRepo.find({
        relations: [
          'propiedad',
          'inquilino',
          'problemas',
          'fotos',
          'tecnicosAsignados',
        ],
      });
      return tickets.map((t) => this.addResolutionTime(t));
    }

    // TÉCNICO ve solo los que atiende
    if (roleNames.includes('tecnico')) {
      const tickets = await this.ticketRepo
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.tecnicosAsignados', 'tec')
        .leftJoinAndSelect('t.fotos', 'f')
        .leftJoinAndSelect('t.problemas', 'p')
        .where('tec.ci = :ci', { ci: user.ci })
        .getMany();

      return tickets.map((t) => this.addResolutionTime(t));
    }

    // INQUILINO ve sus propios tickets
    const tickets = await this.ticketRepo.find({
      where: { idInquilino: user.ci },
      relations: ['propiedad', 'problemas', 'fotos', 'tecnicosAsignados'],
    });

    return tickets.map((t) => this.addResolutionTime(t));
  }

  // ============================
  // OBTENER UN TICKET
  // ============================
  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
      relations: [
        'propiedad',
        'inquilino',
        'problemas',
        'fotos',
        'tecnicosAsignados',
      ],
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return this.addResolutionTime(ticket);
  }

  // ============================
  // ACTUALIZAR CAMPOS BÁSICOS
  // (descr., estado, fechas, prioridad)
  // ============================
  async update(id: number, dto: any, currentUser: User) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    if (dto.descripcion !== undefined) ticket.descripcion = dto.descripcion;

    if (dto.prioridad !== undefined) {
      ticket.prioridad = this.normalizePriority(dto.prioridad);
    }

    if (dto.estado !== undefined) {
      const newStatus = this.normalizeStatus(dto.estado);
      ticket.estado = newStatus;

      // Si pasa a FINALIZADO, setea fechaCierre
      if (newStatus === TicketStatus.FINALIZADO && !ticket.fechaCierre) {
        ticket.fechaCierre = new Date();
      }

      // Si lo "reabres" (ej. de FINALIZADO a PROCESADO), puedes limpiar fechaCierre
      if (
        newStatus !== TicketStatus.FINALIZADO &&
        ticket.fechaCierre &&
        dto.reabrir === true
      ) {
        ticket.fechaCierre = null;
      }
    }

    if (dto.fechaCierre !== undefined) {
      ticket.fechaCierre = dto.fechaCierre ? new Date(dto.fechaCierre) : null;
    }

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // ASIGNAR TÉCNICO
  // ============================
  async assignTechnician(id: number, idTecnico: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
      relations: ['tecnicosAsignados'],
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    const tecnico = await this.userRepo.findOne({
      where: { ci: idTecnico },
    });
    if (!tecnico) throw new NotFoundException('Técnico no encontrado');

    ticket.tecnicosAsignados = ticket.tecnicosAsignados
      ? [...ticket.tecnicosAsignados, tecnico]
      : [tecnico];

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // AGREGAR FOTOS
  // ============================
  async addPhotosToTicket(idTicket: number, files: Express.Multer.File[]) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }

    const photos = files.map((f: Express.Multer.File) =>
      this.photoRepo.create({
        idTicket,
        url: `/uploads/tickets/${f.filename}`,
        filename: f.originalname,
      }),
    );

    await this.photoRepo.save(photos);

    return { message: 'Fotos agregadas correctamente', photos };
  }

  // ============================
  // CERRAR TICKET (FINALIZADO)
  // ============================
  async closeTicket(id: number, closedBy?: User) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = TicketStatus.FINALIZADO;
    ticket.fechaCierre = new Date();
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // REABRIR TICKET (ej. vuelve a PROCESADO)
  // ============================
  async reopenTicket(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = TicketStatus.PROCESADO;
    ticket.fechaCierre = null;
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // CANCELAR TICKET (NO ARREGLADO)
  // ============================
  async cancelTicket(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = TicketStatus.CANCELADO;
    ticket.fechaCierre = new Date();
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // CALIFICAR SERVICIO TÉCNICO
  // ============================
  async rateTicket(id: number, user: User, dto: any) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    // Solo el inquilino que reportó puede calificar
    if (ticket.idInquilino !== user.ci) {
      throw new ForbiddenException('No puedes calificar este ticket');
    }

    const rating = Number(dto.calificacion);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new BadRequestException(
        'La calificación debe ser un número entre 1 y 5',
      );
    }

    ticket.calificacionTecnico = rating;
    ticket.comentarioCalificacion = dto.comentario ?? null;

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // ============================
  // HELPER: TIEMPO DE RESOLUCIÓN
  // ============================
  private addResolutionTime(ticket: Ticket) {
    const t = { ...ticket } as any;
    if (ticket.fechaCierre) {
      const diffMs =
        new Date(ticket.fechaCierre).getTime() -
        new Date(ticket.fechaReporte).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      t.resolutionTime = { days: diffDays, hours: diffHours };
    } else {
      t.resolutionTime = null;
    }
    return t;
  }

  // ============================
  // HELPER: NORMALIZAR PRIORIDAD
  // ============================
  private normalizePriority(value: any): TicketPriority {
    if (!value) return TicketPriority.VERDE;
    const v = String(value).toUpperCase();
    if (v === 'ROJA') return TicketPriority.ROJA;
    if (v === 'NARANJA') return TicketPriority.NARANJA;
    if (v === 'VERDE') return TicketPriority.VERDE;
    return TicketPriority.VERDE;
  }

  // ============================
  // HELPER: NORMALIZAR ESTADO
  // ============================
  private normalizeStatus(value: any): TicketStatus {
    if (!value) return TicketStatus.SOLICITADO;
    const v = String(value).toUpperCase();
    if (v === 'SOLICITADO') return TicketStatus.SOLICITADO;
    if (v === 'PROCESADO') return TicketStatus.PROCESADO;
    if (v === 'DERIVADO') return TicketStatus.DERIVADO;
    if (v === 'FINALIZADO') return TicketStatus.FINALIZADO;
    if (v === 'CANCELADO') return TicketStatus.CANCELADO;
    return TicketStatus.SOLICITADO;
  }
}
