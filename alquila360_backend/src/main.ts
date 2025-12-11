import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './data-source';
import * as bodyParser from 'body-parser';
import { join } from 'path'; // para manejar rutas
import * as express from 'express';

async function bootstrap() {
  try {
   // await AppDataSource.initialize(); 
  //  console.log("Conexión a la base de datos establecida y tablas sincronizadas.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
    process.exit(1); 
  }

  // Crear aplicación NestJS
  const app = await NestFactory.create(AppModule, { cors: true });

  // Body parser
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

  // Exponer carpeta uploads de manera pública
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT ?? 3001; 


  app.enableCors({
    origin: 'http://localhost:3000', // Acepta peticiones solo desde tu frontend Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(port);
  console.log(`Servidor NestJS corriendo en el puerto: ${port}`);
}

bootstrap();
