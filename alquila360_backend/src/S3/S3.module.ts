// src/s3/s3.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Necesario para leer .env
import { S3Service } from './S3.service';

@Module({
 
  imports: [
      ConfigModule // Importamos el módulo de configuración
  ], 
  // 2. PROVEEDORES
  // Declaramos S3Service para que NestJS sepa cómo crearlo
  providers: [S3Service],
  // 3. EXPORTACIONES
  // Es CRÍTICO exportar S3Service para que otros módulos (como PropertyModule)
  // puedan inyectarlo y usarlo.
  exports: [S3Service], 
})
export class S3Module {}