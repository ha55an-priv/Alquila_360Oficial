// src/storage/local-storage.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Asegúrate de que esta carpeta exista en la raíz de tu proyecto (al lado de src)
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads'); 

@Injectable()
export class LocalStorageService {
  constructor() {
    // Asegura que el directorio de subidas exista al iniciar
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const finalDir = path.join(UPLOADS_DIR, folder);
    
    // 1. Crear la carpeta específica de la propiedad si no existe
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // 2. Definir el nombre del archivo
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(finalDir, fileName);

    try {
      // 3. Escribir el buffer del archivo en el disco
      await fs.promises.writeFile(filePath, file.buffer);
      
      // 4. Devolver la URL de acceso local (para guardar en la DB)
      return `/uploads/${folder}/${fileName}`;

    } catch (error) {
      console.error('Error al guardar localmente:', error);
      throw new Error('Error al guardar el archivo localmente.');
    }
  }
}