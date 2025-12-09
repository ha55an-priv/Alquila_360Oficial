import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contrato } from '../entity/contrato.entity';
import { PagoAlquiler } from '../entity/pago_alquiler.entity';
import { ContratoService } from './contrato.service';
import { ContratoController } from './contrato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Contrato, PagoAlquiler])],
  controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratoModule {}
