// src/entity/calificacion-servicio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Contrato } from './contrato.entity';

@Entity('Calificacion_Servicio')
export class CalificacionServicio {
  @PrimaryGeneratedColumn({ name: 'Id_Calificacion' })
  idCalificacion: number;

  @Column({ name: 'Id_Inquilino' })
  idInquilino: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
  inquilino: User;

  @Column({ name: 'Id_Contrato' })
  idContrato: number;

  @ManyToOne(() => Contrato)
  @JoinColumn({ name: 'Id_Contrato', referencedColumnName: 'idContrato' })
  contrato: Contrato;

  @Column({ name: 'Mes_Anio', type: 'nvarchar', length: 7 })
  mesAnio: string; // Formato: YYYY-MM

  @Column({ name: 'Calificacion_General', type: 'int' })
  calificacionGeneral: number; // 1-5

  @Column({ name: 'Comentarios', type: 'nvarchar', length: 500, nullable: true })
  comentarios: string | null;

  @CreateDateColumn({ name: 'Fecha_Calificacion', type: 'datetime' })
  fechaCalificacion: Date;
}