// src/contrato/contrato.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ContratoService } from './contrato.service';

@Controller('contratos')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  // Crear contrato + generar cuotas + marcar propiedad rentada
  @Post()
  create(@Body() dto: any) {
    return this.contratoService.create(dto);
  }

  // Listar todos los contratos
  @Get()
  findAll() {
    return this.contratoService.findAll();
  }

  // Obtener un contrato con sus pagos/cuotas
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratoService.findOne(Number(id));
  }

  // Registrar pago de una cuota
  @Post('pagos/:idPago/registrar')
  registrarPago(@Param('idPago') idPago: string, @Body() dto: any) {
    return this.contratoService.registrarPago(Number(idPago), dto);
  }

  // Cerrar contrato (marcar vencido + liberar propiedad)
  @Post(':id/cerrar')
  cerrar(@Param('id') id: string) {
    return this.contratoService.cerrarContrato(Number(id));
  }
}
