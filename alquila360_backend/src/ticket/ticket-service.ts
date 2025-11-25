import { Express } from 'express';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
import { extractFileUrl, extractFileName } from './file-utils';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(TicketPhoto) private photoRepo: Repository<TicketPhoto>,
    @InjectRepository(Problema) private problemaRepo: Repository<Problema>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createDto: any) {
    const ticket = this.ticketRepo.create({
      idPropiedad: createDto.idPropiedad,
      idInquilino: createDto.idInquilino,
      descripcion: createDto.descripcion ?? null,
      fechaReporte: new Date(createDto.fechaReporte),
      estado: 'Abierto',
    });

    if (createDto.problemas && createDto.problemas.length) {
      const problemas = await this.problemaRepo.find({ where: { idProblema: In(createDto.problemas) }});
      // @ts-ignore
      ticket.problemas = problemas;
    }

    return this.ticketRepo.save(ticket);
  }

  async findAllForUser(user: User) {
    const roleNames = (user.roles || []).map(r => r.nombre?.toLowerCase());

    if (roleNames.includes('administrador') || roleNames.includes('admin')) {
      const tickets = await this.ticketRepo.find({ relations: ['propiedad','inquilino','problemas','fotos','tecnicosAsignados'] });
      return tickets.map(t => this.addResolutionTime(t));
    }

    if (roleNames.includes('tecnico')) {
      const tickets = await this.ticketRepo.createQueryBuilder('t')
        .leftJoinAndSelect('t.tecnicosAsignados','tec')
        .leftJoinAndSelect('t.fotos','f')
        .leftJoinAndSelect('t.problemas','p')
        .where('tec.ci = :ci',{ ci: user.ci })
        .getMany();

      return tickets.map(t => this.addResolutionTime(t));
    }

    const tickets = await this.ticketRepo.find({
      where: { idInquilino: user.ci },
      relations: ['propiedad','problemas','fotos','tecnicosAsignados']
    });

    return tickets.map(t => this.addResolutionTime(t));
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }, relations: ['propiedad','inquilino','problemas','fotos','tecnicosAsignados'] });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');
    return this.addResolutionTime(ticket);
  }

  async update(id: number, dto: any, currentUser: User) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }});
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    if (dto.descripcion !== undefined) ticket.descripcion = dto.descripcion;
    if (dto.estado !== undefined) ticket.estado = dto.estado;
    if (dto.fechaCierre !== undefined) ticket.fechaCierre = dto.fechaCierre ? new Date(dto.fechaCierre) : null;

    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  async assignTechnician(id: number, idTecnico: number) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }, relations: ['tecnicosAsignados'] });
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    const tecnico = await this.userRepo.findOne({ where: { ci: idTecnico } });
    if (!tecnico) throw new NotFoundException('Técnico no encontrado');

    ticket.tecnicosAsignados = ticket.tecnicosAsignados ? [...ticket.tecnicosAsignados, tecnico] : [tecnico];
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  async addPhotosToTicket(idTicket: number, files: Express.Multer.File[]) {
  // Buscar ticket
  const ticket = await this.ticketRepo.findOne({ where: { idTicket } });

  if (!ticket) {
    throw new NotFoundException('Ticket no encontrado');
  }

  // Crear registros de fotos
  const photos = files.map((f: Express.Multer.File) =>
  this.photoRepo.create({
    idTicket,
    url: `/uploads/tickets/${f.filename}`,
    filename: f.originalname,
    }),
  );

  // Guardar en base de datos
  await this.photoRepo.save(photos);

  return { message: 'Fotos agregadas correctamente', photos };
}


  async closeTicket(id: number, closedBy?: User) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }});
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = 'Resuelto';
    ticket.fechaCierre = new Date();
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  async reopenTicket(id: number) {
    const ticket = await this.ticketRepo.findOne({ where: { idTicket: id }});
    if (!ticket) throw new NotFoundException('Ticket no encontrado');

    ticket.estado = 'Reabierto';
    ticket.fechaCierre = null;
    await this.ticketRepo.save(ticket);
    return this.findOne(id);
  }

  private addResolutionTime(ticket: Ticket) {
    const t = { ...ticket } as any;
    if (ticket.fechaCierre) {
      const diffMs = (new Date(ticket.fechaCierre).getTime()) - (new Date(ticket.fechaReporte).getTime());
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      t.resolutionTime = { days: diffDays, hours: diffHours };
    } else {
      t.resolutionTime = null;
    }
    return t;
  }
}
