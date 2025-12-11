import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratoController } from './contrato.controller';
import { ContratoService } from './contrato.service';
import { Contrato } from '../entity/contrato.entity';
import { PagoAlquiler } from '../entity/pago_alquiler.entity';
import { User } from '../entity/user.entity';
import { Propiedad } from '../entity/propiedad.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contrato, PagoAlquiler, User, Propiedad]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ContratoController],
  providers: [ContratoService],
  exports: [ContratoService],
})
export class ContratoModule {}