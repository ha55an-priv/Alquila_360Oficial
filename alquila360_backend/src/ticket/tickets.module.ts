import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './ticket-service';
import { Ticket } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
import { ContratoModule } from '../contrato/contrato.module';
import { PagoTecnico } from '../entity/pagoTecnico.entity'; // <- IMPORTANTE

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      TicketPhoto,
      Problema,
      User,
      PagoTecnico, // <- QUE ESTÉ AQUÍ
    ]),
    ContratoModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
