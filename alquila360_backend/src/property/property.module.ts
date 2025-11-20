// src/property/property.module.ts
import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from './property.entity'; // ✅ Correcto
import { Image } from './image.entity';     // ✅ Correcto
///import { S3Module } from 'src/S3/S3.module';
import { LocalStorageModule } from '../storage/local-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, Image]), LocalStorageModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}