import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CancelContratoDto } from './dto/cancel-contrato.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Contrato } from 'src/entity/contrato.entity';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateContratoDto): Promise<Contrato> {
    return this.contratoService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<Contrato[]> {
    return this.contratoService.findAll(page, limit, sort, order);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOne(@Param('id') id: number): Promise<Contrato> {
    return this.contratoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateContratoDto): Promise<Contrato> {
    return this.contratoService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  cancel(@Param('id') id: number, @Body() dto: CancelContratoDto): Promise<Contrato> {
    return this.contratoService.cancel(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.contratoService.remove(id);
  }
}
