// src/property/property.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Image } from './image.entity';
import { User } from '../entity/user.entity';  
import { LocalStorageModule } from '../storage/local-storage.module';
import { Propiedad } from 'src/entity/propiedad.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      Propiedad,
      Image,
      User,     
    ]),
    LocalStorageModule,
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  // (Opcional pero útil si otros módulos necesitan repos de Property/Image/User)
  // exports: [TypeOrmModule],
})
export class PropertyModule {}
