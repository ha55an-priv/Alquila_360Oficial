import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Propiedad } from './propiedad.entity';
import { PagoAlquiler } from './pago_alquiler.entity';

export enum TipoMulta {
  MONTO_FIJO = 'MONTO_FIJO',
  PORCENTAJE = 'PORCENTAJE',
}

export enum EstadoContrato {
  ACTIVO = 'ACTIVO',
  VENCIDO = 'VENCIDO',
  CANCELADO = 'CANCELADO',
}

@Entity('Contrato')
export class Contrato {
  @PrimaryGeneratedColumn({ name: 'Id_Contrato' })
  idContrato: number;

  @Column({ name: 'Id_Inquilino' })
  idInquilino: number;

  @Column({ name: 'Id_Propiedad' })
  idPropiedad: number;

  @ManyToOne(() => User, (user) => user.contratosInquilino)
  @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
  inquilino: User;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.contratos)
  @JoinColumn({ name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' })
  propiedad: Propiedad;

  @Column({ name: 'F_ini', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'F_Fin', type: 'date', nullable: true })
  fechaFin: Date | null;

  @Column({ name: 'Contrato_Explicacion', type: 'nvarchar', length: 300, nullable: true })
  explicacion: string | null;

  @Column({ name: 'Precio_mensual', type: 'decimal', precision: 10, scale: 2 })
  precioMensual: string;

  @Column({ name: 'Adelanto', type: 'decimal', precision: 10, scale: 2, nullable: true })
  adelanto: string | null;

  @Column({ name: 'Garantia', type: 'decimal', precision: 10, scale: 2 })
  garantia: string;

  @Column({ name: 'Tipo_Multa', type: 'enum', enum: TipoMulta, default: TipoMulta.PORCENTAJE })
  tipoMulta: TipoMulta;

  @Column({ name: 'Multa_Retraso', type: 'decimal', precision: 10, scale: 2, nullable: true })
  multaRetraso: string | null;

  @Column({ name: 'Estado', type: 'enum', enum: EstadoContrato, default: EstadoContrato.ACTIVO })
  estado: EstadoContrato;

  @OneToMany(() => PagoAlquiler, (pago) => pago.contrato)
  pagos: PagoAlquiler[];
}