import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { ContratoModule } from './contrato/contrato.module';
import { PagoAlquilerModule } from './pago_alquiler/pago_alquiler.module';
import { SharedModule } from './shared/shared.module';
import { PdfGeneratorModule } from './shared/pdf-generator/pdf-generator.module';
import { S3Module } from './S3/S3.module';
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

@Module({
  imports: [
    // 1. CONFIGURACIÓN DEL ENTORNO
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', // Aún necesario para el S3Service (aunque lo usamos local)
    }),
    
    // 2. CONFIGURACIÓN PRINCIPAL DE TYPEORM (SOLUCIÓN MANUAL DE EMERGENCIA)
    TypeOrmModule.forRoot({
      type: 'mysql', 
      host: '127.0.0.1',      // ⬅️ Manualmente 'localhost'
      port: 3308,             // ⬅️ Manualmente 3306
      username: 'alquila360_admin',       // ⬅️ Manualmente 'root'
      password: '123456789',   // ⬅️ Manualmente '12345678'
      database: 'alquila360',  // ⬅️ Manualmente 'alquila360'
      
      dropSchema: false,
      autoLoadEntities: false,
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
        Problema, 
        Resena, 
        PagoTecnico
    ], 
      synchronize: false, 
      
    }),

    // 3. MÓDULOS DE LA APLICACIÓN
    // Asegúrate de que UserModule, AuthModule, y PropertyModule vayan DESPUÉS.
    UserModule, 
    AuthModule,
    ContratoModule, 
    PagoAlquilerModule,
    SharedModule,
    PdfGeneratorModule,
    S3Module,
  ],
  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}