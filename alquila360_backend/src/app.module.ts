import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { PropertyModule } from './property/property.module';

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
      host: 'localhost',      // ⬅️ Manualmente 'localhost'
      port: 3306,             // ⬅️ Manualmente 3306
      username: 'root',       // ⬅️ Manualmente 'root'
      password: '12345678',   // ⬅️ Manualmente '12345678'
      database: 'alquila360',  // ⬅️ Manualmente 'alquila360'
      
      autoLoadEntities: true, 
      synchronize: true, 
    }),

    // 3. MÓDULOS DE LA APLICACIÓN
    // Asegúrate de que UserModule, AuthModule, y PropertyModule vayan DESPUÉS.
    UserModule, 
    AuthModule,
    PropertyModule, 
  ],
  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}