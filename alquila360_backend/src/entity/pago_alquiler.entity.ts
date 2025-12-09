// src/entity/pago_alquiler.entity.ts
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contrato } from './contrato.entity';

export enum EstadoCuota {
  PENDIENTE = 'PENDIENTE',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
}

@Entity('Pago_Alquiler')
export class PagoAlquiler {
  @PrimaryGeneratedColumn({ name: 'Id_Pago' })
  idPago: number;

  // ============================
  // RELACIÓN CON CONTRATO
  // ============================
  @Column({ name: 'Id_Contrato' })
  idContrato: number;

  @ManyToOne(() => Contrato, (contrato) => contrato.pagos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Id_Contrato', referencedColumnName: 'idContrato' })
  contrato: Contrato;

  // ============================
  // INFORMACIÓN DE LA CUOTA
  // ============================

  // número de cuota (1, 2, 3, ...)
  @Column({ name: 'Nro_Cuota', type: 'int' })
  numeroCuota: number;

  // Fecha de vencimiento de la cuota
  @Column({ name: 'Fecha_Vencimiento', type: 'date' })
  fechaVencimiento: Date;

  // Fecha en que se paga realmente (nullable si aún no se pagó)
  @Column({ name: 'Fecha_Pago', type: 'date', nullable: true })
  fechaPago: Date | null;

  // Monto base de la cuota (sin multa)
  @Column({
    name: 'Monto_Base',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  montoBase: string;

  // Multa aplicada (si se pagó tarde)
  @Column({
    name: 'Multa_Aplicada',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  multaAplicada: string | null;

  // Monto total a pagar (montoBase + multaAplicada)
  @Column({
    name: 'Monto_Total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  montoTotal: string;

  // Estado de la cuota: PENDIENTE / PAGADO / VENCIDO
  @Column({
    name: 'Estado',
    type: 'enum',
    enum: EstadoCuota,
    default: EstadoCuota.PENDIENTE,
  })
  estado: EstadoCuota;

  // ============================
  // MÉTODO Y MOTIVO
  // ============================

  @Column({
    name: 'Metodo_de_Pago',
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  metodoDePago: string | null;

  // Motivo (ej. “pago total”, “pago parcial”, “ajuste”, etc.)
  @Column({ name: 'Motivo', type: 'nvarchar', length: 100, nullable: true })
  motivo: string | null;
}
