import { Express } from 'express';
import { Controller, Post, Get, Patch, Param, Body, UploadedFiles, UseInterceptors, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ticketsDiskStorage } from './uploads.config';
import { TicketsService } from './ticket-service';
import { CreateTicketDto } from './create-ticket.dto';
import { UpdateTicketDto } from './update-ticket.dto';
import { AssignTechnicianDto } from './assign-technician.dto';


// Placeholder decorators - reemplaza con tus guards/roles
function CurrentUser() { return (target:any, key:any, index:any) => {}; }
function Roles(...r:any[]) { return (target:any, key:any, descriptor:any) => {}; }

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  async create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const user = req.user;
    return this.ticketsService.findAllForUser(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTicketDto, @Req() req:any) {
    const user = req.user;
    return this.ticketsService.update(id, dto, user);
  }

  @Post(':id/assign')
  async assign(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignTechnicianDto) {
    return this.ticketsService.assignTechnician(id, dto.idTecnico);
  }

   @UseInterceptors(FilesInterceptor('photos', 10, { storage: ticketsDiskStorage }))
@Post(':id/photos')
async uploadPhotos(
  @Param('id') id: number,
  @UploadedFiles() files: Express.Multer.File[], // TIPADO CORRECTO
) {
  return this.ticketsService.addPhotosToTicket(id, files);
}

  @Post(':id/close')
  async close(@Param('id', ParseIntPipe) id: number, @Req() req:any) {
    const user = req.user;
    return this.ticketsService.closeTicket(id, user);
  }

  @Post(':id/reopen')
  async reopen(@Param('id', ParseIntPipe) id: number) {
    return this.ticketsService.reopenTicket(id);
  }
}
