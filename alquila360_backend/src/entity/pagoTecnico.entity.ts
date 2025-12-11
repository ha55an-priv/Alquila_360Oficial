import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Ticket } from "./ticket.entity"; 
import { User } from "./user.entity"; 

@Entity('Pago_Tecnico')
export class PagoTecnico {

    @PrimaryColumn({ name: 'Id_Ticket' })
    idTicket: number; 

    @PrimaryColumn({ name: 'Fecha', type: 'date' })
    fecha: Date;
    
    @Column({ name: 'Id_Tecnico' })
    idTecnico: number; 

    @ManyToOne(() => Ticket, ticket => ticket.pagosTecnico)
   // @JoinColumn({ name: 'Id_Ticket', referencedColumnName: 'idTicket' })
    ticket: Ticket;

    @ManyToOne(() => User, user => user.pagosRecibidos)
    @JoinColumn({ name: 'Id_Tecnico', referencedColumnName: 'ci' })
    tecnico: User;


    @Column({ name: 'Motivo', type: 'nvarchar', length: 100, nullable: true })
    motivo: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    monto: number | null; 

    @Column({ name: 'Metodo_de_Pago', type: 'nvarchar', length: 50, nullable: true })
    metodoDePago: string | null;
}