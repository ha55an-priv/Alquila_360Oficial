import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../entity/user.entity';

import { Image } from './image.entity'; 

@Entity('properties') // El nombre real de la tabla en MySQL
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

 
 @ManyToOne(() => User, user => user.properties)
  @JoinColumn({ name: 'ownerId' }) 
  owner: User;
  
  @Column()
  ownerId: number; // Columna de clave foránea explícita

  // 📝 Información básica
  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  type: string; // Ej: 'Apartamento', 'Casa', 'Oficina'

  // 📍 Ubicación
  @Column({ length: 255 })
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 20, nullable: true })
  zipCode: string;

  // 📐 Detalles
  @Column('int')
  bedrooms: number;

  @Column('int')
  bathrooms: number;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number; // Metros cuadrados

  // 💰 Precios y disponibilidad
  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Precio de alquiler mensual

  @Column({ default: true })
  isAvailable: boolean;
  
  // 📸 Relación con las imágenes: Una propiedad tiene muchas imágenes
  @OneToMany(() => Image, image => image.property)
  images: Image[];
}