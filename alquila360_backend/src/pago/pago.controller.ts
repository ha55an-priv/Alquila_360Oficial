import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './pago.service';
import { CreatePaymentDto } from './dto/create-pago.dto';
import { RegisterPaymentDto } from './dto/register-pago.dto';
import { UpdatePaymentDto } from './dto/update-pago.dto';
import { FilterPaymentDto } from './dto/filter-pago.dto';
import { FilterPagoTecnicoDto } from './dto/filter-pago-tecnico.dto';
import { CreatePagoTecnicoDto } from './dto/create-pago-tecnico.dto';
import { RegisterPagoTecnicoDto } from './dto/register-pago-tecnico.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // ===== PagoAlquiler =====
  @Post('alquiler')
  createAlquiler(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createAlquiler(dto);
  }

  @Put('alquiler/:idPago/register')
  registerAlquiler(
    @Param('idPago', ParseIntPipe) idPago: number,
    @Body() dto: RegisterPaymentDto,
  ) {
    return this.paymentsService.registerAlquiler(idPago, dto);
  }

  @Get('alquiler')
  findAllAlquiler(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query() filter?: FilterPaymentDto,
  ) {
    return this.paymentsService.findAllAlquiler(page, limit, sort, order, filter);
  }

  @Get('alquiler/:idPago')
  findOneAlquiler(@Param('idPago', ParseIntPipe) idPago: number) {
    return this.paymentsService.findOneAlquiler(idPago);
  }

  @Put('alquiler/:idPago')
  updateAlquiler(
    @Param('idPago', ParseIntPipe) idPago: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updateAlquiler(idPago, dto);
  }

  @Delete('alquiler/:idPago')
  removeAlquiler(@Param('idPago', ParseIntPipe) idPago: number) {
    return this.paymentsService.removeAlquiler(idPago);
  }

  // ===== PagoTecnico =====
  @Post('tecnico')
  createTecnico(@Body() dto: CreatePagoTecnicoDto) {
    return this.paymentsService.createTecnico(dto);
  }

  @Put('tecnico/:idTicket/register')
  registerTecnico(
    @Param('idTicket', ParseIntPipe) idTicket: number,
    @Body() dto: RegisterPagoTecnicoDto,
  ) {
    const fecha = dto.fechaPago;
    return this.paymentsService.registerTecnico(idTicket, fecha, dto);
  }

  @Get('tecnico')
  findAllTecnico(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query() filter?: FilterPagoTecnicoDto,
  ) {
    return this.paymentsService.findAllTecnico(page, limit, sort, order);
  }

  @Get('tecnico/:idTicket/:fecha')
  findOneTecnico(
    @Param('idTicket', ParseIntPipe) idTicket: number,
    @Param('fecha') fecha: string,
  ) {
    return this.paymentsService.findOneTecnico(idTicket, fecha);
  }

  @Put('tecnico/:idTicket/:fecha')
  updateTecnico(
    @Param('idTicket', ParseIntPipe) idTicket: number,
    @Param('fecha') fecha: string,
    @Body() dto: RegisterPagoTecnicoDto,
  ) {
    return this.paymentsService.updateTecnico(idTicket, fecha, dto);
  }

  @Delete('tecnico/:idTicket/:fecha')
  removeTecnico(
    @Param('idTicket', ParseIntPipe) idTicket: number,
    @Param('fecha') fecha: string,
  ) {
    return this.paymentsService.removeTecnico(idTicket, fecha);
  }
}