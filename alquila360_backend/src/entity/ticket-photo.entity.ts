import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('TicketPhoto')
export class TicketPhoto {
  @PrimaryGeneratedColumn({ name: 'Id_Photo' })
  id: number;

  @ManyToOne(() => Ticket, (ticket) => ticket.fotos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Id_Ticket', referencedColumnName: 'idTicket' })
  ticket: Ticket;

  @Column({ name: 'Id_Ticket' })
  idTicket: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  filename?: string;   

  @Column({ type: 'varchar', length: 255, nullable: true })
  publicId?: string;   

  @CreateDateColumn({ name: 'UploadedAt', type: 'datetime' })
  uploadedAt: Date;
}
