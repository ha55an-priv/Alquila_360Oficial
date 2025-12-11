// src/property/property.controller.ts

import { 
    Controller, Get, Post, Put, Delete, Body, Param, 
    UseInterceptors, UploadedFiles, BadRequestException, 
    ValidationPipe, ParseIntPipe, UseGuards, Req
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PropertyService } from './property.service'; 
import { CreatePropertyDto } from './dto/create-property.dto'; 
import { UpdatePropertyDto } from './dto/update-property.dto'; 
import { Express } from 'express'; 
import { Propiedad } from 'src/entity/propiedad.entity'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}


  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, { /* ... */ }))
  async create(
    @Body(new ValidationPipe({ transform: true })) createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Array<Express.Multer.File>, 
  ): Promise<Propiedad> { 
    if (!files || files.length === 0) {
      throw new BadRequestException('Se requiere al menos una imagen para la propiedad.');
    }
    
    const userIdDePrueba = 1; 
    
    return this.propertyService.createWithImages(createPropertyDto, userIdDePrueba, files);
  }

  @Get()
  async findAll(): Promise<Propiedad[]> { 
    return this.propertyService.findAll(); 
  }
  

@UseGuards(JwtAuthGuard)
@Get('owner') 
    async getOwnerProperties(@Req() req: Request): Promise<Propiedad[]> {
        const userCi = (req.user as any)?.ci; 
        
        if (!userCi) {
             throw new BadRequestException('Usuario no autenticado o CI no encontrada en el token.');
        }

        return this.propertyService.findOwnerProperties(userCi); 
    }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Propiedad> { 
    return this.propertyService.findOne(id); 
  }
  
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) updatePropertyDto: UpdatePropertyDto,
  ): Promise<Propiedad> {
    return this.propertyService.update(id, updatePropertyDto); 
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.remove(id); 
  }

    
}