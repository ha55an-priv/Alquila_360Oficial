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
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
import { ticketsDiskStorage } from './uploads.config';

import { TicketsService } from './ticket-service';
import { CreateTicketDto } from './create-ticket.dto';
import { UpdateTicketDto } from './update-ticket.dto';
import { AssignTechnicianDto } from './assign-technician.dto';
import { CalificarTicketDto } from './calificar-ticket.dto';

// AUTH
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// ENTIDADES
import { User } from '../entity/user.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ==================================================
  // CREAR TICKET (inquilino)
  // ==================================================
  @Post()
  @Roles('inquilino', 'admin')
  async create(
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: User,
  ) {
    // INQUILINO REAL: forzar idInquilino = user.ci
    dto.idInquilino = user.ci;
    return this.ticketsService.create(dto);
  }

  // ==================================================
  // LISTAR TICKETS (según usuario / rol)
  // ==================================================
  @Get()
  async findAll(@CurrentUser() user: User) {
    return this.ticketsService.findAllForUser(user);
  }

  // ==================================================
  // OBTENER UN TICKET
  // ==================================================
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  // ==================================================
  // ACTUALIZAR TICKET
  // ==================================================
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.update(id, dto, user);
  }

  // ==================================================
  // ASIGNAR TÉCNICO (solo admin)
  // ==================================================
  @Post(':id/assign')
  @Roles('admin', 'administrador')
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTechnicianDto,
  ) {
    return this.ticketsService.assignTechnician(id, dto.idTecnico);
  }

  // ==================================================
  // SUBIR FOTOS
  // ==================================================
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

  // ==================================================
  // CERRAR TICKET (admin o técnico asignado)
  // ==================================================
  @Post(':id/close')
  @Roles('admin', 'tecnico')
  async close(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.closeTicket(id, user);
  }

  // ==================================================
  // REABRIR TICKET (solo admin)
  // ==================================================
  @Post(':id/reopen')
  @Roles('admin')
  async reopen(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.reopenTicket(id);
  }

  // ==================================================
  // CALIFICAR TÉCNICO (solo INQUILINO dueño del ticket)
  // ==================================================
  @Post(':id/calificar')
  @Roles('inquilino')
  async calificar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CalificarTicketDto,
    @CurrentUser() user: User,
  ) {
    return this.ticketsService.rateTicket(id, dto, user);
  }

  // ==================================================
  // PROMEDIO DE CALIFICACIÓN POR TÉCNICO
  // ==================================================
  @Get('tecnico/:id/promedio-calificacion')
  async getPromedioTecnico(
    @Param('id', ParseIntPipe) idTecnico: number,
  ) {
    return this.ticketsService.getAverageRatingForTechnician(idTecnico);
  }

  // ==================================================
  // ESTADÍSTICAS
  // (TODAS SOLO PARA ADMIN)
  // ==================================================
  @Roles('admin')
  @Get('stats/status')
  async statsByStatus() {
    return this.ticketsService.getStatsByStatus();
  }

  @Roles('admin')
  @Get('stats/priority')
  async statsByPriority() {
    return this.ticketsService.getStatsByPriority();
  }

  @Roles('admin')
  @Get('stats/resolution-time')
  async avgResolutionTime() {
    return this.ticketsService.getAverageResolutionTime();
  }

  @Roles('admin')
  @Get('stats/top-tecnicos-asignados')
  async topTecnicosAsignados() {
    return this.ticketsService.getTopTechniciansByAssignedTickets();
  }

  @Roles('admin')
  @Get('stats/top-tecnicos-rapidos')
  async topTecnicosRapidos() {
    return this.ticketsService.getTopTechniciansByResolutionTime();
  }

  @Roles('admin')
  @Get('stats/top-propiedades')
  async topPropiedades() {
    return this.ticketsService.getTopPropertiesByTickets();
  }

  @Roles('admin')
  @Get('stats/top-inquilinos')
  async topInquilinos() {
    return this.ticketsService.getTopInquilinosByTickets();
  }
    // ============================
  // REGISTRAR PAGO AL TÉCNICO DE UN TICKET
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/registrar-pago-tecnico')
  registrarPagoTecnico(
    @Param('id') id: string,
    @Body()
    dto: {
      idTecnico: number;
      fecha?: string;
      monto?: number;
      motivo?: string;
      metodoDePago?: string;
    },
  ) {
    return this.ticketsService.registrarPagoTecnico(
      Number(id),
      dto,
    );
  }

  // ============================
  // LISTAR PAGOS RECIBIDOS POR UN TÉCNICO
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'tecnico')
  @Get('tecnicos/:id/pagos')
  getPagosPorTecnico(@Param('id') id: string) {
    return this.ticketsService.listarPagosPorTecnico(Number(id));
  }

}
