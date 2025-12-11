import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { CreateContratoDto } from './dto/create-contrato.dto';
import { UpdateContratoDto } from './dto/update-contrato.dto';
import { CancelContratoDto } from './dto/cancel-contrato.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Contrato } from 'src/entity/contrato.entity';

@Controller('contratos')
@UseGuards(JwtAuthGuard, RolesGuard) // Se aplica a todo el controller
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  // -------------------------
  // CREAR CONTRATO (Solo Admin)
  // -------------------------
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateContratoDto): Promise<Contrato> {
    return this.contratoService.create(dto);
  }

  // -------------------------
  // OBTENER TODOS LOS CONTRATOS (Admin y Usuario)
  // -------------------------
  @Get()
  @Roles('Admin', 'Usuario')
  getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<Contrato[]> {
    return this.contratoService.findAll(page, limit, sort, order);
  }

  // -------------------------
  // OBTENER UN CONTRATO POR ID (Admin y Usuario)
  // -------------------------
  @Get(':id')
  @Roles('Admin', 'Usuario')
  getOne(@Param('id') id: number): Promise<Contrato> {
    return this.contratoService.findOne(id);
  }

  // -------------------------
  // ACTUALIZAR CONTRATO (Solo Admin)
  // -------------------------
  @Put(':id')
  @Roles('Admin')
  update(@Param('id') id: number, @Body() dto: UpdateContratoDto): Promise<Contrato> {
    return this.contratoService.update(id, dto);
  }

  // -------------------------
  // CANCELAR CONTRATO (Solo Admin)
  // -------------------------
  @Post(':id/cancel')
  @Roles('Admin')
  cancel(@Param('id') id: number, @Body() dto: CancelContratoDto): Promise<Contrato> {
    return this.contratoService.cancel(id, dto);
  }

  // ELIMINAR CONTRATO (Solo Admin)
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: number): Promise<void> {
    return this.contratoService.remove(id);
  }
}
