// src/property/property.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property } from './property.entity';
import { Image } from './image.entity';
import { User } from '../entity/user.entity';   // 👈 IMPORTAR User
import { LocalStorageModule } from '../storage/local-storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      Image,
      User,           // 👈 AÑADIR User AQUÍ
    ]),
    LocalStorageModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  // (Opcional pero útil si otros módulos necesitan repos de Property/Image/User)
  // exports: [TypeOrmModule],
})
export class PropertyModule {}
