// src/property/image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity('property_images')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔗 Relación con la propiedad
  @ManyToOne(() => Property, property => property.images)
  @JoinColumn({ name: 'propertyId' }) // La columna FK en esta tabla
  property: Property;
  
  @Column()
  propertyId: number; // Columna de clave foránea explícita

  // 🖼️ URL real de la imagen almacenada en S3, GCS o tu servidor
  @Column('text')
  url: string; 

  @Column({ default: 0 })
  order: number; // Para ordenar la visualización de las fotos
}