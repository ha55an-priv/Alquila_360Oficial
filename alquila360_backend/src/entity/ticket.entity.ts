import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Propiedad } from './propiedad.entity';
import { User } from './user.entity';
import { Problema } from './problema.entity';
import { PagoTecnico } from './pagoTecnico.entity';
import { TicketPhoto } from './ticket-photo.entity';

export enum TicketPriority {
  ROJA = 'ROJA',
  NARANJA = 'NARANJA',
  VERDE = 'VERDE',
}

export enum TicketStatus {
  SOLICITADO = 'SOLICITADO',
  PROCESADO = 'PROCESADO',
  DERIVADO = 'DERIVADO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

@Entity('Ticket')
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'Id_Ticket' })
  idTicket: number;

  @ManyToOne(() => Propiedad, (propiedad) => propiedad.tickets)
  @JoinColumn({ name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' })
  propiedad: Propiedad;

  @Column({ name: 'Id_Propiedad' })
  idPropiedad: number;

  @ManyToOne(() => User, (user) => user.ticketsReportados)
  @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
  inquilino: User;

  @Column({ name: 'Id_Inquilino' })
  idInquilino: number;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  descripcion?: string | null;

  @Column({ name: 'Fecha_Reporte', type: 'timestamp' })
  fechaReporte: Date;

  @Column({ name: 'Fecha_Cierre', type: 'timestamp', nullable: true })
  fechaCierre?: Date | null;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.VERDE,
  })
  prioridad: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.SOLICITADO,
  })
  estado: TicketStatus;

  @OneToMany(() => TicketPhoto, (photo) => photo.ticket, { cascade: true })
  fotos: TicketPhoto[];

  @ManyToMany(() => Problema, (problema) => problema.tickets)
  @JoinTable({
    name: 'Ticket_Problema',
    joinColumn: { name: 'Id_Ticket', referencedColumnName: 'idTicket' },
    inverseJoinColumn: { name: 'Id_Problema', referencedColumnName: 'idProblema' },
  })
  problemas: Problema[];

  @ManyToMany(() => Problema, (problema) => problema.ticketsEmergencia)
  @JoinTable({
    name: 'Ticket_Emergencia',
    joinColumn: { name: 'Id_Ticket', referencedColumnName: 'idTicket' },
    inverseJoinColumn: { name: 'Id_Problema', referencedColumnName: 'idProblema' },
  })
  problemasEmergencia: Problema[];

  @ManyToMany(() => User, (user) => user.ticketsAtendidos)
  @JoinTable({
    name: 'Atiende',
    joinColumn: { name: 'Id_Ticket', referencedColumnName: 'idTicket' },
    inverseJoinColumn: { name: 'Id_Tecnico', referencedColumnName: 'ci' },
  })
  tecnicosAsignados: User[];

  @OneToMany(() => PagoTecnico, (pago) => pago.ticket)
  pagosTecnico: PagoTecnico[];

  @Column({ type: 'int', nullable: true })
  calificacionTecnico?: number | null;

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  comentarioCalificacion?: string | null;
}