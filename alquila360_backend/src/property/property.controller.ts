// src/property/property.controller.ts

import { 
    Controller, 
    Post, 
    Body, 
    UseInterceptors, 
    UploadedFiles, 
    BadRequestException, 
    ValidationPipe 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto'; 
//import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express } from 'express'; // ⬅️ Necesario para el tipado de Multer

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // @UseGuards(JwtAuthGuard) // ⬅️ Mantenemos comentado
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, {
    // Aquí puedes configurar opciones de Multer
  }))
  async create(
    // 🛑 CORRECCIÓN CLAVE: Aplicar ValidationPipe con { transform: true }
    // Esto fuerza la conversión de strings de form-data a los tipos definidos en el DTO (@Type)
    @Body(new ValidationPipe({ transform: true })) createPropertyDto: CreatePropertyDto,
    
    // 🛠️ Usamos Array<...> para evitar problemas de tipado de TS
    @UploadedFiles() files: Array<Express.Multer.File>, 
    // @Req() req: any, // Ya no es necesario si solo usamos el ownerId de prueba
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Se requiere al menos una imagen para la propiedad.');
    }

    
    const ownerIdDePrueba = 1; 
    
    return this.propertyService.createWithImages(createPropertyDto, ownerIdDePrueba, files);
  }
}