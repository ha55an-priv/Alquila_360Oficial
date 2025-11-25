import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tecnico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;
}

