import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { Ticket } from '../entity/ticket.entity';
import { TicketPhoto } from '../entity/ticket-photo.entity';
import { Problema } from '../entity/problema.entity';
import { User } from '../entity/user.entity';
import { AlertModule } from 'src/alert/alert.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, TicketPhoto, Problema, User]),
    forwardRef(() => AlertModule),
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
