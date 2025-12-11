// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { TicketsModule } from './ticket/tickets.module';
import { ContratoModule } from './contrato/contrato.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './entity/user.entity';
import { Property } from './property/property.entity';
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
      port: 3306,
      username: 'alquila360_admin',
      password: '10902218',
      database: 'alquila360',

      autoLoadEntities: true,
      synchronize: true,
      entities: [User, Property, Image],
    }),

    // 3. MÓDULOS
    UserModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    ContractsModule,
    PaymentsModule,
    TicketsModule,
    ReviewsModule,
    ReportsModule,
  ],

  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}
