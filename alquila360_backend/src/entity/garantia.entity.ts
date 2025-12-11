// src/entity/garantia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Contrato } from './contrato.entity';

export enum EstadoGarantia {
  PENDIENTE = 'PENDIENTE',
  DEVUELTA = 'DEVUELTA',
  RETENIDA = 'RETENIDA',
  APLICADA = 'APLICADA', // Para cubrir daños
}

@Entity('Garantia')
export class Garantia {
  @PrimaryGeneratedColumn({ name: 'Id_Garantia' })
  idGarantia: number;

  @Column({ name: 'Id_Contrato' })
  idContrato: number;

  @ManyToOne(() => Contrato, contrato => contrato.garantia)
  @JoinColumn({ name: 'Id_Contrato', referencedColumnName: 'idContrato' })
  contrato: Contrato;

  @Column({ 
    name: 'Monto',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  monto: string; // Igual a 1 mes de alquiler

  @Column({
    name: 'Estado',
    type: 'enum',
    enum: EstadoGarantia,
    default: EstadoGarantia.PENDIENTE
  })
  estado: EstadoGarantia;

  @Column({ name: 'Fecha_Deposito', type: 'date' })
  fechaDeposito: Date;

  @Column({ name: 'Fecha_Devolucion', type: 'date', nullable: true })
  fechaDevolucion: Date | null;

  @Column({ 
    name: 'Motivo_Retencion',
    type: 'nvarchar',
    length: 300,
    nullable: true 
  })
  motivoRetencion: string | null;

  @Column({ 
    name: 'Monto_Retenido',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true 
  })
  montoRetenido: string | null;

  @Column({ name: 'Comprobante_Path', type: 'varchar', length: 500, nullable: true })
  comprobantePath: string | null;

  @Column({ name: 'Observaciones', type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn({ name: 'Fecha_Registro', type: 'datetime' })
  fechaRegistro: Date;
}