// src/pago-tecnico/pagos-tecnico.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PagosTecnicoService } from './pagos-tecnico.service';
import { CreatePagoTecnicoDto } from './dto/create-pago-tecnico.dto';
import { MarkPaidPagoTecnicoDto } from './dto/mark-paid-pago-tecnico.dto';

@Controller('pagos-tecnico')
export class PagosTecnicoController {
  constructor(
    private readonly pagosTecnicoService: PagosTecnicoService,
  ) {}

  @Post()
  async create(@Body() dto: CreatePagoTecnicoDto) {
    return this.pagosTecnicoService.create(dto);
  }

  @Patch('pagar')
  async markPaid(@Body() dto: MarkPaidPagoTecnicoDto) {
    return this.pagosTecnicoService.markPaid(dto);
  }

  @Get()
  async findAll() {
    return this.pagosTecnicoService.findAll();
  }

  @Get('tecnico/:idTecnico')
  async findByTechnician(
    @Param('idTecnico', ParseIntPipe) idTecnico: number,
  ) {
    return this.pagosTecnicoService.findByTechnician(idTecnico);
  }
}
