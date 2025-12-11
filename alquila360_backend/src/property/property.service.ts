// src/property/property.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 🛑 IMPORTACIONES CORREGIDAS
import { Propiedad } from 'src/entity/propiedad.entity'; // Usar la nueva entidad Propiedad
import { Image } from './image.entity'; 
import { CreatePropertyDto } from './dto/create-property.dto'; // DTO corregido
import { LocalStorageService } from '../storage/local-storage.service'; 
import { UpdatePropertyDto } from './dto/update-property.dto'; 
import { Express } from 'express';



@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Propiedad)
    private propiedadRepository: Repository<Propiedad>, // Cambiamos el nombre de la variable para ser más claro
    @InjectRepository(Image) 
    private imageRepository: Repository<Image>,
    
    private localStorageService: LocalStorageService, 
  ) {}

  async createWithImages(
    createPropertyDto: CreatePropertyDto, 
    userId: number, 
    files: Express.Multer.File[]
  ): Promise<Propiedad> { 
    

    const newPropiedad = this.propiedadRepository.create({
      ...createPropertyDto,
     
    });
    const savedPropiedad = await this.propiedadRepository.save(newPropiedad); 

    const imageEntities: Image[] = [];
    
    // 1.2. Procesar y guardar imágenes
    for (const [index, file] of files.entries()) {
      const folderName = `propiedades/${savedPropiedad.idPropiedad}`; 
      const imageUrl = await this.localStorageService.uploadFile(file, folderName);
      
      const newImage = this.imageRepository.create({
        url: imageUrl,
        property: savedPropiedad as any, // 🛑 TypeORM podría requerir 'Propiedad' si la entidad 'Image' está mal
        order: index,
      });
      imageEntities.push(newImage);
    }
    
    // 1.3. Guardar todas las URLs de las imágenes
    await this.imageRepository.save(imageEntities);

    // 1.4. Devolver la propiedad con sus imágenes
    savedPropiedad.images = imageEntities; // 🛑 Asumo que tu entidad Propiedad tiene 'images: Image[]'
    return savedPropiedad; // 🛑 Devolvemos Propiedad
  }

  async findAll(): Promise<Propiedad[]> { // 🛑 El tipo de retorno debe ser Propiedad[]
        return this.propiedadRepository.find({ // 🛑 Usamos el nuevo repositorio
            relations: ['images'], 
            order: {
                idPropiedad: 'DESC', // 🛑 Usamos el nuevo ID
            },
        });
    }

    async findOne(id: number): Promise<Propiedad> { // 🛑 El tipo de retorno debe ser Propiedad
        const propiedad = await this.propiedadRepository.findOne({ // 🛑 Usamos el nuevo repositorio
            where: { idPropiedad: id }, // 🛑 Usamos el nuevo ID
            relations: ['images', 'propietarios'], // 🛑 'owner' ya no existe, usamos 'propietarios'
        });

        if (!propiedad) {
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada.`);
        }
        return propiedad;
    }

    async update(
        id: number, 
        updatePropertyDto: UpdatePropertyDto,
    ): Promise<Propiedad> { // 🛑 El tipo de retorno debe ser Propiedad
        // 1. Buscar la propiedad existente
        const propiedad = await this.propiedadRepository.findOneBy({ idPropiedad: id }); // 🛑 Usamos el nuevo ID

        if (!propiedad) {
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada para actualizar.`);
        }

        const updatedPropiedad = this.propiedadRepository.merge(propiedad, updatePropertyDto); // 🛑 Usamos el nuevo repositorio

        return this.propiedadRepository.save(updatedPropiedad); // 🛑 Usamos el nuevo repositorio
    }

    async remove(id: number): Promise<{ message: string }> {
       
        const propiedad = await this.propiedadRepository.findOne({ // 🛑 Usamos el nuevo repositorio
            where: { idPropiedad: id }, // 🛑 Usamos el nuevo ID
            relations: ['images'],
        });

        if (!propiedad) {
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada para eliminar.`);
        }

        const result = await this.propiedadRepository.delete(id); 
        if (result.affected === 0) {
            
            throw new NotFoundException(`Propiedad con ID ${id} no encontrada.`);
        }

        return { message: `Propiedad con ID ${id} eliminada exitosamente.` };
    }

  async findOwnerProperties(ownerId: number): Promise<Propiedad[]> {
      // Asumiendo que tienes una relación ManyToMany entre User y Propiedad,
      // o que ya tienes un método para filtrar por el ID del propietario.
      return this.propiedadRepository.find({
        where: {
            propietarios: { // 1. Nombre de la propiedad (el array ManyToMany)
               ci: ownerId, // 2. Condición en el campo de la ENTIDAD RELACIONADA (User)
            },
        },
     relations: ['images', 'propietarios'], 
    });
  }
}