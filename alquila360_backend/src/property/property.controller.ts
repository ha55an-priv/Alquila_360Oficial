// src/property/property.controller.ts
import { Controller, Post, Body, UseGuards, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express'; // ⬅️ Importamos el interceptor
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  
  @UseInterceptors(FilesInterceptor('images', 10, {
    // Aquí puedes configurar opciones de Multer, como el límite de tamaño de archivo, etc.
  }))
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[], // ⬅️ Recibimos los archivos
    @Req() req: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Se requiere al menos una imagen para la propiedad.');
    }

    const ownerId = req.user.userId; 
    
    // ⚠️ ATENCIÓN: Aquí, 'files' contiene los archivos. Necesitas enviarlos a un servicio de almacenamiento (AWS S3, etc.)
    
    // 2. Llamamos al servicio para guardar la propiedad y las imágenes
    return this.propertyService.createWithImages(createPropertyDto, ownerId, files);
  }
}