// src/property/image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Propiedad } from '../entity/propiedad.entity'; 
// ...

@Entity('images')
export class Image {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    url: string; 

    @Column('int')
    order: number; 

    @ManyToOne(() => Propiedad, propiedad => propiedad.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'propiedadId' })
    property: Propiedad;


}