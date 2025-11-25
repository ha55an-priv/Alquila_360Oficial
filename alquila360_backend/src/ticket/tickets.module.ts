import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './ticket-service';
import { Ticket } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketPhoto, Problema, User])],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
