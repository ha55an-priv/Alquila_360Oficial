// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { TicketsModule } from './ticket/tickets.module';
import { ContratoModule } from './contrato/contrato.module';

// Entidades requeridas
import { User } from "./entity/user.entity"; 
import { TelefonoUsuario } from "./entity/telefonoUsuario.entity";
import { EmailUsuario } from "./entity/emailUsuario.entity"; 
import { Role } from "./entity/rol.entity";
import { Propiedad } from "./entity/propiedad.entity";
import { Contrato } from "./entity/contrato.entity";
import { MetodoPago } from "./entity/metodoPago.entity";
import { PagoAlquiler } from "./entity/pago_alquiler.entity";
import { Ticket } from "./entity/ticket.entity";
import { Problema } from "./entity/problema.entity";
import { Resena } from "./entity/resena.entity";
import { PagoTecnico } from "./entity/pagoTecnico.entity";
import { TicketPhoto } from "./entity/photo.entity";

import { Image } from './property/image.entity';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    // 1. CONFIGURACIÓN DEL ENTORNO
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. CONFIGURACIÓN DE TYPEORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'alquila360_admin',     // ⚠️ Usuario que te funcionaba
      password: '10902218',             // ⚠️ Tu contraseña
      database: 'alquila360',

      entities: [
              User,
              EmailUsuario,
              TelefonoUsuario, 
              Role, 
              Propiedad, 
              Contrato, 
              MetodoPago, 
              PagoAlquiler, 
              Ticket, 
              TicketPhoto,
              Problema, 
              Resena, 
              PagoTecnico,
              Image
          ],
      //autoLoadEntities: true,
      dropSchema: false,
      synchronize: false,
      //entities: [User, Property, Image], // Puedes dejarlo o quitarlo si usas autoLoadEntities
    }),

    // 3. MÓDULOS
    UserModule,
    AuthModule,
    PropertyModule,
    RoleModule,
    TicketsModule,
    ContratoModule,
  ],

  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}
