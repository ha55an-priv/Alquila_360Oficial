// src/contrato/contrato.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ContratoService } from './contrato.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  // Crear contrato + generar cuotas + marcar propiedad rentada
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: any) {
    return this.contratoService.create(dto);
  }

  // Listar todos los contratos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.contratoService.findAll();
  }

  // Obtener un contrato con sus pagos/cuotas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'inquilino')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratoService.findOne(Number(id));
  }

  // Registrar pago de una cuota
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('pagos/:idPago/registrar')
  registrarPago(@Param('idPago') idPago: string, @Body() dto: any) {
    return this.contratoService.registrarPago(Number(idPago), dto);
  }

  // Cerrar contrato (marcar vencido + liberar propiedad)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':id/cerrar')
  cerrar(@Param('id') id: string) {
    return this.contratoService.cerrarContrato(Number(id));
  }

  // ============================
  // ESTADO DE CUENTA DEL INQUILINO LOGUEADO
  // ============================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('inquilino','admin')
  @Get('mi/estado-cuenta')
  getEstadoCuenta(@CurrentUser() user: any) {
    // asumimos que user.ci es el CI del inquilino
    return this.contratoService.obtenerEstadoCuentaInquilino(user.ci);
  }
}
