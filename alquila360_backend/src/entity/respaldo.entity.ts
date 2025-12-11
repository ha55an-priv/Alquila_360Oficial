// src/entity/respaldo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TipoRespaldo {
  COMPLETO = 'COMPLETO',
  INCREMENTAL = 'INCREMENTAL',
  DIARIO = 'DIARIO'
}

export enum EstadoRespaldo {
  EXITOSO = 'EXITOSO',
  FALLIDO = 'FALLIDO',
  EN_PROGRESO = 'EN_PROGRESO'
}

@Entity('Respaldo')
export class Respaldo {
  @PrimaryGeneratedColumn({ name: 'Id_Respaldo' })
  idRespaldo: number;

  @Column({ name: 'Nombre_Archivo', type: 'nvarchar', length: 255 })
  nombreArchivo: string;

  @Column({ name: 'Ruta_Archivo', type: 'nvarchar', length: 500 })
  rutaArchivo: string;

  @Column({ name: 'Ruta_Local', type: 'nvarchar', length: 500, nullable: true })
  rutaLocal: string | null;

  @Column({
    name: 'Tipo',
    type: 'nvarchar',
    length: 20,
    default: TipoRespaldo.DIARIO
  })
  tipo: TipoRespaldo;

  @Column({
    name: 'Estado',
    type: 'nvarchar',
    length: 20,
    default: EstadoRespaldo.EN_PROGRESO
  })
  estado: EstadoRespaldo;

  @Column({ name: 'Tamanio_MB', type: 'decimal', precision: 10, scale: 2 })
  tamanioMB: string;

  @Column({ name: 'Hash_SHA256', type: 'nvarchar', length: 64, nullable: true })
  hashSHA256: string | null;

  @CreateDateColumn({ name: 'Fecha_Respaldo', type: 'datetime' })
  fechaRespaldo: Date;

  @Column({ name: 'Notas', type: 'nvarchar', length: 500, nullable: true })
  notas: string | null;
}