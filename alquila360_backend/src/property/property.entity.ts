// src/property/property.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../entity/user.entity';
import { Image } from './image.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  // 👇 Relación CORRECTA (solo esta)
  @ManyToOne(() => User, user => user.propiedades, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @Column({ length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  bedrooms: number;

  @Column('int')
  bathrooms: number;

  @Column('decimal', { precision: 10, scale: 2 })
  area: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: true })
  isAvailable: boolean;

  @OneToMany(() => Image, image => image.property)
  images: Image[];
}
