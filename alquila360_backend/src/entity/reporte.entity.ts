// src/entity/reporte.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum TipoReporte {
  MOROSIDAD = 'MOROSIDAD',
  CONTRATOS_ACTIVOS = 'CONTRATOS_ACTIVOS',
  PROPIEDADES_ALQUILADAS = 'PROPIEDADES_ALQUILADAS',
  TICKETS_MANTENIMIENTO = 'TICKETS_MANTENIMIENTO',
  INGRESOS_MENSUALES = 'INGRESOS_MENSUALES'
}

export enum FormatoReporte {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV'
}

@Entity('Reporte')
export class Reporte {
  @PrimaryGeneratedColumn({ name: 'Id_Reporte' })
  idReporte: number;

  @Column({ name: 'Id_Usuario' })
  idUsuario: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'Id_Usuario', referencedColumnName: 'ci' })
  usuario: User;

  @Column({
    name: 'Tipo',
    type: 'nvarchar',
    length: 50
  })
  tipo: TipoReporte;

  @Column({ name: 'Nombre', type: 'nvarchar', length: 200 })
  nombre: string;

  @Column({ name: 'Ruta_Archivo', type: 'nvarchar', length: 500, nullable: true })
  rutaArchivo: string | null;

  @Column({
    name: 'Formato',
    type: 'nvarchar',
    length: 10,
    default: FormatoReporte.PDF
  })
  formato: FormatoReporte;

  @Column({ name: 'Fecha_Inicio', type: 'date', nullable: true })
  fechaInicio: Date | null;

  @Column({ name: 'Fecha_Fin', type: 'date', nullable: true })
  fechaFin: Date | null;

  @CreateDateColumn({ name: 'Fecha_Generacion', type: 'datetime' })
  fechaGeneracion: Date;

  @Column({ name: 'Estado', type: 'nvarchar', length: 20, default: 'GENERADO' })
  estado: string;
}