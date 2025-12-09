// src/pago-tecnico/pagos-tecnico.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoTecnico } from '../entity/pagoTecnico.entity';
import { Ticket } from '../entity/ticket.entity';
import { User } from '../entity/user.entity';
import { PagosTecnicoService } from './pagos-tecnico.service';
import { PagosTecnicoController } from './pagos-tecnico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PagoTecnico, Ticket, User])],
  controllers: [PagosTecnicoController],
  providers: [PagosTecnicoService],
  exports: [PagosTecnicoService],
})
export class PagosTecnicoModule {}
