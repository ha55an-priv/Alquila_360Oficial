import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddMultiplePhotosDto } from './dto/add-photo.dto';
import { RateTicketDto } from './dto/rate-ticket.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  // ===================== RUTA ESTADÍSTICAS DEBE IR PRIMERO
  @Get('stats/overall')
  async getStats(@Query() filterDto?: FilterTicketDto) {
    return this.ticketsService.getStats(filterDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query() filterDto?: FilterTicketDto
  ) {
    return this.ticketsService.findAll(Number(page) || 1, Number(limit) || 10, sort, order, filterDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.remove(id);
  }

  @Post(':id/assign-technicians')
  async assignTechnicians(@Param('id', ParseIntPipe) id: number, @Body() assignDto: AssignTechnicianDto) {
    return this.ticketsService.assignTechnicians(id, assignDto);
  }

  @Put(':id/status')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() statusDto: UpdateStatusDto) {
    return this.ticketsService.updateStatus(id, statusDto);
  }

  @Post(':id/photos')
  async addPhotos(@Param('id', ParseIntPipe) id: number, @Body() addPhotosDto: AddMultiplePhotosDto) {
    return this.ticketsService.addPhotos(id, addPhotosDto);
  }

  @Post(':id/rate')
  async rateTicket(@Param('id', ParseIntPipe) id: number, @Body() rateDto: RateTicketDto) {
    return this.ticketsService.rateTicket(id, rateDto);
  }

  @Get('technician/:id')
  async getByTechnician(
    @Param('id', ParseIntPipe) idTecnico: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query() filterDto?: FilterTicketDto
  ) {
    return this.ticketsService.findByTechnician(idTecnico, Number(page) || 1, Number(limit) || 10, sort, order, filterDto);
  }
 /*
  @Get('technician-performance')
  async getTechnicianPerformance(@Query() filterDto?: FilterTicketDto) {
    return this.ticketsService.getTechnicianPerformance(filterDto);
  }*/
}