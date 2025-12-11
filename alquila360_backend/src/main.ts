import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import AppDataSource from './data-source';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  
 /*
     try {
       await AppDataSource.initialize(); 
       console.log("Conexión a la base de datos establecida y tablas sincronizadas."); // ⬅️ Puedes cambiar este mensaje.
     } catch (error) {
       console.error("Error al inicializar la base de datos:", error);
        process.exit(1);   
    }
*/
    const app = await NestFactory.create(AppModule, { cors: true });
    
    const port = process.env.PORT ?? 3001; 
    await app.listen(port);
     console.log(`Servidor NestJS corriendo en el puerto: ${port}`);
  }

bootstrap();


  
