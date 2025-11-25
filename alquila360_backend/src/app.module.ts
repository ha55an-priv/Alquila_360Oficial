// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';
import { User } from './entity/user.entity'; 
import { Property } from './property/property.entity'; // ✅ Importación de Property
import { Image } from './property/image.entity'; 

@Module({
  imports: [
    // 1. CONFIGURACIÓN DEL ENTORNO
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    
    // 2. CONFIGURACIÓN PRINCIPAL DE TYPEORM (SOLUCIÓN MANUAL DE EMERGENCIA)
   TypeOrmModule.forRoot({
      type: 'mysql', 
      host: 'localhost',      
      port: 3306,             
      username: 'root',       
      password: '12345678',   
      database: 'alquila360',
      
     
      entities: [
        User,       
        Property, // ⬅️ ¡AÑADIDA! Era el eslabón perdido que 'Image' necesita.
        Image,
      ],
      
      synchronize: true, 
    }),

    // 3. Módulos de la Aplicación
    UserModule, 
    AuthModule,
    PropertyModule, 
  ],
  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}