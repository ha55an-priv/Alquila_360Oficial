// src/entity/historial-contrato.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Contrato } from './contrato.entity';
import { User } from './user.entity';

export enum AccionContrato {
  CREACION = 'CREACION',
  MODIFICACION = 'MODIFICACION',
  RENOVACION = 'RENOVACION',
  CANCELACION = 'CANCELACION'
}

@Entity('Historial_Contrato')
export class HistorialContrato {
  @PrimaryGeneratedColumn({ name: 'Id_Historial' })
  idHistorial: number;

  @Column({ name: 'Id_Contrato' })
  idContrato: number;

  @ManyToOne(() => Contrato)
  @JoinColumn({ name: 'Id_Contrato', referencedColumnName: 'idContrato' })
  contrato: Contrato;

  @Column({
    name: 'Accion',
    type: 'nvarchar',
    length: 50
  })
  accion: AccionContrato;

  @Column({ name: 'Detalles', type: 'nvarchar', length: 1000, nullable: true })
  detalles: string | null;

  @Column({ name: 'Id_Usuario_Accion', nullable: true })
  idUsuarioAccion: number | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'Id_Usuario_Accion', referencedColumnName: 'ci' })
  usuarioAccion: User | null;

  @CreateDateColumn({ name: 'Fecha_Accion', type: 'datetime' })
  fechaAccion: Date;
}