// src/property/property.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './property.entity';
import { Image } from './image.entity'; 
import { CreatePropertyDto } from './dto/create-property.dto';
// import { S3Service } from '../S3/S3.service'; // ⬅️ Comentado/Eliminado
import { LocalStorageService } from '../storage/local-storage.service'; // ⬅️ ¡MÓDULO LOCAL!

// ⚠️ Usamos el tipo Express.Multer.File
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer; // El contenido del archivo
        filename: string;
        // etc.
      }
    }
  }
}

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Image) 
    private imageRepository: Repository<Image>,
    // ⬅️ CAMBIO CLAVE: INYECTAR EL SERVICIO DE ALMACENAMIENTO LOCAL
    private localStorageService: LocalStorageService, 
  ) {}

  async createWithImages(
    createPropertyDto: CreatePropertyDto, 
    ownerId: number, 
    files: Express.Multer.File[]
  ): Promise<Property> {
    
    // 1.1. Guardar la propiedad básica
    const newProperty = this.propertyRepository.create({
      ...createPropertyDto,
      ownerId,
    });
    const savedProperty = await this.propertyRepository.save(newProperty);

    const imageEntities: Image[] = [];
    
    // 1.2. Procesar y guardar imágenes
    for (const [index, file] of files.entries()) {
      
      // 🚀 CAMBIO CLAVE: USAR EL SERVICIO LOCAL PARA GUARDAR LA IMAGEN
      const folderName = `propiedades/${savedProperty.id}`;
      const imageUrl = await this.localStorageService.uploadFile(file, folderName);
      
      const newImage = this.imageRepository.create({
        url: imageUrl,
        property: savedProperty, // Enlazamos la entidad
        order: index,
      });
      imageEntities.push(newImage);
    }
    
    // 1.3. Guardar todas las URLs de las imágenes
    await this.imageRepository.save(imageEntities);

    // 1.4. Devolver la propiedad con sus imágenes
    savedProperty.images = imageEntities;
    return savedProperty;
  }
}