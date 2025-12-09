// src/tickets/tickets.controller.ts
import { Express } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ticketsDiskStorage } from './uploads.config';
import { TicketsService } from './ticket-service';
import { CreateTicketDto } from './create-ticket.dto';
import { UpdateTicketDto } from './update-ticket.dto';
import { AssignTechnicianDto } from './assign-technician.dto';

import { CalificarTicketDto } from './calificar-ticket.dto';

// Placeholder decorators - reemplaza con tus guards/roles reales después
function CurrentUser() {
  return (target: any, key: any, index: any) => {};
}
function Roles(...r: any[]) {
  return (target: any, key: any, descriptor: any) => {};
}

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // Crear ticket
  @Post()
  async create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  // Listar tickets (según usuario / rol)
  @Get()
  async findAll(@Req() req: any) {
    const user = req.user ?? null; // mientras no tengamos auth real
    return this.ticketsService.findAllForUser(user);
  }

  // Obtener un ticket por ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  // Actualizar ticket (descrición, estado, fecha cierre, etc.)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
    @Req() req: any,
  ) {
    const user = req.user ?? null;
    return this.ticketsService.update(id, dto, user);
  }

  // Asignar técnico a un ticket
  @Post(':id/assign')
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTechnicianDto,
  ) {
    return this.ticketsService.assignTechnician(id, dto.idTecnico);
  }

  // Subir fotos al ticket
  @UseInterceptors(
    FilesInterceptor('photos', 10, { storage: ticketsDiskStorage }),
  )
  @Post(':id/photos')
  async uploadPhotos(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.ticketsService.addPhotosToTicket(id, files);
  }

  // Cerrar ticket
  @Post(':id/close')
  async close(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const user = req.user ?? null;
    return this.ticketsService.closeTicket(id, user);
  }

  // Reabrir ticket
  @Post(':id/reopen')
  async reopen(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.reopenTicket(id);
  }

  // ==============================
  // CALIFICAR TÉCNICO
  // ==============================
  @Post(':id/calificar')
  async calificar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CalificarTicketDto,
    @Req() req: any,
  ) {
    const user = req.user ?? null; // luego irá el inquilino real autenticado
    return this.ticketsService.rateTicket(id, dto, user);
  }

  // ==============================
  // PROMEDIO DE CALIFICACIÓN POR TÉCNICO
  // ==============================
  @Get('tecnico/:id/promedio-calificacion')
  async getPromedioTecnico(
    @Param('id', ParseIntPipe) idTecnico: number,
  ) {
    return this.ticketsService.getAverageRatingForTechnician(
      idTecnico,
    );
  }
}
