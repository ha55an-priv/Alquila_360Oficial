// src/property/property.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../entity/user.entity';
import { Image } from './image.entity'; 

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

<<<<<<< HEAD
 
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;
  
  @Column()
  ownerId: number; // Columna de clave foránea explícita
=======
  @ManyToOne(() => User, user => user.properties)
  @JoinColumn({ name: 'ownerId' }) 
  owner: User;
  
  @Column()
  ownerId: number; 
>>>>>>> origin/master

  // 📝 Información básica
  @Column({ length: 255 })
  title: string; // ⬅️ Sin valor por defecto, por eso falló

  @Column('text')
  description: string;

  // ... (Otras columnas de texto)

  // 📐 Detalles (Decimales y enteros)
  @Column('int')
  bedrooms: number;

  @Column('int')
  bathrooms: number;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number; 

  // 💰 Precios y disponibilidad
  @Column('decimal', { precision: 10, scale: 2 })
  price: number; 

  @Column({ default: true })
  isAvailable: boolean;
  
  // 📸 Relación
  @OneToMany(() => Image, image => image.property)
  images: Image[];
}