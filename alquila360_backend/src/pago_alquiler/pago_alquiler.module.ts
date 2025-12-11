// pago-alquiler.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoAlquiler } from 'src/entity/pago_alquiler.entity'; // Tu entidad
import { Contrato } from 'src/entity/contrato.entity'; // Necesitas la entidad Contrato
import { PagoAlquilerService } from './pago_alquiler.service';
import { PagoAlquilerController } from './pago_alquiler.controller';
import { PdfGeneratorModule } from 'src/shared/pdf-generator/pdf-generator.module';
import { ContratoModule } from 'src/contrato/contrato.module';

@Module({
  imports: [
    // El módulo necesita acceso a su propio repositorio y al de Contrato (para referencias)
    TypeOrmModule.forFeature([PagoAlquiler, Contrato]), 
    PdfGeneratorModule,
    ContratoModule,
  ],
  controllers: [PagoAlquilerController],
  providers: [PagoAlquilerService],
  exports: [PagoAlquilerService], // Exportamos si ContratoModule necesita crear cuotas
})
export class PagoAlquilerModule {}