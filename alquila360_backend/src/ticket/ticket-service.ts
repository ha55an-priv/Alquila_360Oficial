// src/tickets/ticket-service.ts
import { Express } from 'express';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
import { CalificarTicketDto } from './calificar-ticket.dto';

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

  // =====================================
  // CREAR TICKET
  // =====================================
  async create(createDto: any) {
    const ticket = this.ticketRepo.create({
      idPropiedad: createDto.idPropiedad,
      idInquilino: createDto.idInquilino,
      descripcion: createDto.descripcion ?? null,
      fechaReporte: new Date(createDto.fechaReporte ?? new Date()),
      estado: 'SOLICITADO' as TicketStatus,
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

  // =====================================
  // LISTAR TICKETS (según usuario)
  // =====================================
  async findAllForUser(user?: User | null) {
    // Mientras no tengas auth montado, si user es null devolvemos todo
    if (!user) {
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

    const roleNames = (user.roles || []).map((r) =>
      r.nombre?.toLowerCase(),
    );

    // Admin ve todos los tickets
    if (
      roleNames.includes('administrador') ||
      roleNames.includes('admin')
    ) {
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

    // Técnico ve los tickets que tiene asignados
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

    // Inquilino ve los tickets que reportó
    const tickets = await this.ticketRepo.find({
      where: { idInquilino: user.ci },
      relations: [
        'propiedad',
        'problemas',
        'fotos',
        'tecnicosAsignados',
      ],
    });

    return tickets.map((t) => this.addResolutionTime(t));
  }

  // =====================================
  // OBTENER UN TICKET POR ID
  // =====================================
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

  // =====================================
  // ACTUALIZAR TICKET
  // =====================================
  async update(id: number, dto: any, currentUser?: User | null) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    if (dto.descripcion !== undefined)
      ticket.descripcion = dto.descripcion;

    if (dto.estado !== undefined)
      ticket.estado = dto.estado as TicketStatus;

    if (dto.fechaCierre !== undefined)
      ticket.fechaCierre = dto.fechaCierre
        ? new Date(dto.fechaCierre)
        : null;

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // =====================================
  // ASIGNAR TÉCNICO
  // =====================================
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

  // =====================================
  // AGREGAR FOTOS
  // =====================================
  async addPhotosToTicket(
    idTicket: number,
    files: Express.Multer.File[],
  ) {
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

  // =====================================
  // CERRAR TICKET
  // =====================================
  async closeTicket(id: number, closedBy?: User | null) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = 'FINALIZADO' as TicketStatus;
    ticket.fechaCierre = new Date();

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // =====================================
  // REABRIR TICKET
  // =====================================
  async reopenTicket(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
    });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = 'SOLICITADO' as TicketStatus;
    ticket.fechaCierre = null;

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // =====================================
  // CALIFICAR TÉCNICO
  // =====================================
  async rateTicket(
    id: number,
    dto: CalificarTicketDto,
    currentUser?: User | null,
  ) {
    const ticket = await this.ticketRepo.findOne({
      where: { idTicket: id },
      relations: ['inquilino', 'tecnicosAsignados'],
    });

    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    if (ticket.estado !== TicketStatus.FINALIZADO) {
      throw new BadRequestException(
        'Solo se pueden calificar tickets finalizados',
      );
    }

    // Opcional: solo el inquilino que reportó puede calificar
    if (currentUser && ticket.idInquilino !== currentUser.ci) {
      throw new ForbiddenException(
        'Solo el inquilino que reportó el ticket puede calificar',
      );
    }

    ticket.calificacionTecnico = dto.calificacionTecnico;
    ticket.comentarioCalificacion =
      dto.comentarioCalificacion ?? null;

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  // =====================================
  // PROMEDIO DE CALIFICACIÓN POR TÉCNICO
  // =====================================
// En ticket-service.ts
async getAverageRatingForTechnician(idTecnico: number) {
  const qb = this.ticketRepo
    .createQueryBuilder('t')
    .leftJoin('t.tecnicosAsignados', 'tec')
    .where('tec.ci = :idTecnico', { idTecnico })
    .andWhere('t.calificacionTecnico IS NOT NULL')
    .select('AVG(t.calificacionTecnico)', 'avg');

  const result = await qb.getRawOne<{ avg: string | null }>();

  const avg = result?.avg ?? null;

  return {
    idTecnico,
    promedio: avg !== null ? parseFloat(avg) : null,
  };
}

  // =====================================
  // HELPER: TIEMPO DE RESOLUCIÓN
  // =====================================
  private addResolutionTime(ticket: Ticket) {
    const t = { ...ticket } as any;
    if (ticket.fechaCierre) {
      const diffMs =
        new Date(ticket.fechaCierre).getTime() -
        new Date(ticket.fechaReporte).getTime();
      const diffDays = Math.floor(
        diffMs / (1000 * 60 * 60 * 24),
      );
      const diffHours = Math.floor(
        diffMs / (1000 * 60 * 60),
      );
      t.resolutionTime = { days: diffDays, hours: diffHours };
    } else {
      t.resolutionTime = null;
    }
    return t;
  }
}
