import { Injectable, NotFoundException } from "@nestjs/common";
import AppDataSource from "../data-source";
import { Repository, DeepPartial } from "typeorm";
import { Ticket } from "../entity/ticket.entity";
import { CreateTicketDto, UpdateTicketDto } from "./ticket.dto";

@Injectable()
export class TicketService {
  private repo: Repository<Ticket>;

  constructor() {
    this.repo = AppDataSource.getRepository(Ticket);
  }

  async create(data: CreateTicketDto): Promise<Ticket> {
    const ent: DeepPartial<Ticket> = {
      Id_Propiedad: data.Id_Propiedad,
      Id_Inquilino: data.Id_Inquilino,
      Descripcion: data.Descripcion ?? null,
      Fecha_Reporte: data.Fecha_Reporte ? new Date(data.Fecha_Reporte) : new Date(),
      Estado: data.Estado ?? "Pendiente",
      Fotos: data.Fotos ?? null,
    };

    const entity = this.repo.create(ent);
    return await this.repo.save(entity);
  }

  async findAll(): Promise<Ticket[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.repo.findOneBy({ Id_Ticket: id });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);

    if (dto.Descripcion !== undefined) ticket.Descripcion = dto.Descripcion ?? null;
    if (dto.Estado !== undefined) ticket.Estado = dto.Estado ?? null;
    if (dto.Fotos !== undefined) ticket.Fotos = dto.Fotos ?? null;

    if (dto.Fecha_Resolucion !== undefined) {
      ticket.Fecha_Resolucion = dto.Fecha_Resolucion ? new Date(dto.Fecha_Resolucion) : null;

      if (ticket.Fecha_Resolucion && ticket.Fecha_Reporte) {
        const diffMs = ticket.Fecha_Resolucion.getTime() - new Date(ticket.Fecha_Reporte).getTime();
        ticket.Tiempo_Resolucion_Horas = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
      } else {
        ticket.Tiempo_Resolucion_Horas = null;
      }
    }

    await this.repo.save(ticket);
    return ticket;
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const res = await this.repo.delete(id);
    return { deleted: (res.affected ?? 0) > 0 };
  }
}
