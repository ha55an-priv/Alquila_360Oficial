import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { User } from '../entity/user.entity';
import { TelefonoUsuario } from '../entity/telefonoUsuario.entity';
import { EmailUsuario } from '../entity/emailUsuario.entity';
import { Role } from '../entity/rol.entity';
import { Propiedad } from '../entity/propiedad.entity';
import { Contrato } from '../entity/contrato.entity';
import { MetodoPago } from '../entity/metodoPago.entity';
import { Ticket } from '../entity/ticket.entity';
import { PagoTecnico } from '../entity/pagoTecnico.entity';
import { Resena } from '../entity/resena.entity';
import { PagoAlquiler } from '../entity/pago_alquiler.entity';
import { TicketPhoto } from "../entity/photo.entity";
import { Problema } from 'src/entity/problema.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      TelefonoUsuario,
      EmailUsuario,
      Role,
      Propiedad,
      Contrato,
      MetodoPago,
      Ticket,
      PagoTecnico,
      Resena,
      PagoAlquiler,
      TicketPhoto,
      Ticket,        
      Problema,
      AuthModule,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
