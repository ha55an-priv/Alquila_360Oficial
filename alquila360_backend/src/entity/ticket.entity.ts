// src/entity/ticket.entity.ts
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Propiedad } from './propiedad.entity';
import { User } from './user.entity';
import { Problema } from './problema.entity';
import { PagoTecnico } from './pagoTecnico.entity';
import { TicketPhoto } from './photo.entity';

export enum TicketPriority {
  ROJA = 'ROJA',       // daño material grave
  NARANJA = 'NARANJA', // afecta al inquilino
  VERDE = 'VERDE',     // no urgente
}

export enum TicketStatus {
  SOLICITADO = 'SOLICITADO',
  PROCESADO = 'PROCESADO',
  DERIVADO = 'DERIVADO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO', // no arreglado / cancelado
}

@Entity('Ticket')
export class Ticket {
  @PrimaryGeneratedColumn({ name: 'Id_Ticket' })
  idTicket: number;

  // ============================
  // RELACIÓN CON PROPIEDAD
  // ============================
  @ManyToOne(() => Propiedad, (propiedad) => propiedad.tickets)
  @JoinColumn({ name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' })
  propiedad: Propiedad;

  @Column({ name: 'Id_Propiedad' })
  idPropiedad: number;

  // ============================
  // RELACIÓN CON INQUILINO
  // ============================
  @ManyToOne(() => User, (user) => user.ticketsReportados)
  @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
  inquilino: User;

  @Column({ name: 'Id_Inquilino' })
  idInquilino: number;

  // ============================
  // DATOS DEL TICKET
  // ============================
  @Column({ type: 'nvarchar', length: 300, nullable: true })
  descripcion: string | null;

  @Column({ name: 'Fecha_Reporte', type: 'date', nullable: false })
  fechaReporte: Date;

  @Column({ name: 'Fecha_Cierre', type: 'date', nullable: true })
  fechaCierre?: Date | null;

  // PRIORIDAD (ROJA / NARANJA / VERDE)
  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.VERDE,
  })
  prioridad: TicketPriority;

  // ESTADO (SOLICITADO / PROCESADO / DERIVADO / FINALIZADO / CANCELADO)
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.SOLICITADO,
  })
  estado: TicketStatus;

  // FOTOS DEL TICKET
  @OneToMany(() => TicketPhoto, (photo) => photo.ticket, { cascade: true })
  fotos: TicketPhoto[];

  // ============================
  // PROBLEMAS (CATALOGO)
  // ============================
  @ManyToMany(() => Problema, (problema) => problema.tickets)
  @JoinTable({
    name: 'Ticket_Problema',
    joinColumn: {
      name: 'Id_Ticket',
      referencedColumnName: 'idTicket',
    },
    inverseJoinColumn: {
      name: 'Id_Problema',
      referencedColumnName: 'idProblema',
    },
  })
  problemas: Problema[];

  // PROBLEMAS MARCADOS COMO EMERGENCIA
  @ManyToMany(() => Problema, (problema) => problema.ticketsEmergencia)
  @JoinTable({
    name: 'Emergencia',
    joinColumn: {
      name: 'Id_Ticket',
      referencedColumnName: 'idTicket',
    },
    inverseJoinColumn: {
      name: 'Id_Problema',
      referencedColumnName: 'idProblema',
    },
  })
  problemasEmergencia: Problema[];

  // ============================
  // TÉCNICOS ASIGNADOS
  // ============================
  @ManyToMany(() => User, (user) => user.ticketsAtendidos)
  @JoinTable({
    name: 'Atiende',
    joinColumn: {
      name: 'Id_Ticket',
      referencedColumnName: 'idTicket',
    },
    inverseJoinColumn: {
      name: 'Id_Tecnico',
      referencedColumnName: 'ci',
    },
  })
  tecnicosAsignados: User[];

  // ============================
  // PAGOS AL TÉCNICO
  // ============================
  @OneToMany(() => PagoTecnico, (pago) => pago.ticket)
  pagosTecnico: PagoTecnico[];

  // ============================
  // CALIFICACIÓN DEL SERVICIO
  // ============================
  @Column({ type: 'int', nullable: true })
  calificacionTecnico?: number | null; // 1–5

  @Column({ type: 'nvarchar', length: 300, nullable: true })
  comentarioCalificacion?: string | null;
}
