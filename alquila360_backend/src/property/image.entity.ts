// src/property/image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity'; 

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    // 🚨 VERIFICA QUE @Column ESTÉ PRESENTE AQUÍ
    @Column({ length: 500 })
    url: string; // URL donde se almacena la imagen

    // 🚨 VERIFICA QUE @Column ESTÉ PRESENTE AQUÍ
    @Column('int')
    order: number; // Orden de la imagen (si lo estás usando)

    // ... (El resto de la relación)
   @ManyToOne(() => Property, property => property.images) // ✅ Función de flecha y 'property.images'
    property: Property;

    @Column()
    propertyId: number; 
}