// src/entity/alerta.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum TipoAlerta {
  PAGO_VENCIDO = 'PAGO_VENCIDO',
  CONTRATO_VENCER = 'CONTRATO_VENCER',
  TICKET_NUEVO = 'TICKET_NUEVO',
  BLOQUEO_USUARIO = 'BLOQUEO_USUARIO',
  SISTEMA = 'SISTEMA'
}

export enum EstadoAlerta {
  PENDIENTE = 'PENDIENTE',
  ENVIADA = 'ENVIADA',
  LEIDA = 'LEIDA'
}

@Entity('Alerta')
export class Alerta {
  @PrimaryGeneratedColumn({ name: 'Id_Alerta' })
  idAlerta: number;

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
  tipo: TipoAlerta;

  @Column({ name: 'Titulo', type: 'nvarchar', length: 200 })
  titulo: string;

  @Column({ name: 'Mensaje', type: 'nvarchar', length: 500 })
  mensaje: string;

  @Column({
    name: 'Estado',
    type: 'nvarchar',
    length: 20,
    default: EstadoAlerta.PENDIENTE
  })
  estado: EstadoAlerta;

  @Column({ name: 'Entidad_Relacionada', type: 'nvarchar', length: 100, nullable: true })
  entidadRelacionada: string | null;

  @Column({ name: 'Id_Entidad_Relacionada', nullable: true })
  idEntidadRelacionada: number | null;

  @CreateDateColumn({ name: 'Fecha_Creacion', type: 'datetime' })
  fechaCreacion: Date;

  @Column({ name: 'Fecha_Envio', type: 'datetime', nullable: true })
  fechaEnvio: Date | null;

  @Column({ name: 'Fecha_Lectura', type: 'datetime', nullable: true })
  fechaLectura: Date | null;
}