import { Column, Entity,OneToMany, PrimaryGeneratedColumn,JoinTable, ManyToOne, ManyToMany, JoinColumn } from "typeorm";
import { Propiedad } from "./propiedad.entity"; 
import { User } from "./user.entity"; 
import { Problema } from "./problema.entity";
import { PagoTecnico } from "./pagoTecnico.entity";

@Entity('Ticket')
export class Ticket {

    @PrimaryGeneratedColumn({ name: 'Id_Ticket' })
    idTicket: number;

    @ManyToOne(() => Propiedad, propiedad => propiedad.tickets)
    @JoinColumn({ name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' })
    propiedad: Propiedad;

    @ManyToOne(() => User, user => user.ticketsReportados)
    @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
   inquilino: User;
    
    @Column({ type: 'nvarchar', length: 300, nullable: true })
    descripcion: string | null;

    @Column({ name: 'Fecha_Reporte', type: 'date', nullable: false })
    fechaReporte: Date;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    estado: string | null; 

    @ManyToMany(() => Problema, problema => problema.tickets)
    @JoinTable({
        name: 'Ticket_Problema', 
        joinColumn: {
            name: 'Id_Ticket', 
            referencedColumnName: 'idTicket' 
        },
        inverseJoinColumn: {
            name: 'Id_Problema', 
            referencedColumnName: 'idProblema' 
        }
    })
    problemas: Problema[];

    @ManyToMany(() => Problema, problema => problema.ticketsEmergencia)
    @JoinTable({
        name: 'Emergencia', 
        joinColumn: {
            name: 'Id_Ticket', 
            referencedColumnName: 'idTicket' 
        },
        inverseJoinColumn: {
            name: 'Id_Problema', 
            referencedColumnName: 'idProblema' 
        }
    })
    problemasEmergencia: Problema[];

    @ManyToMany(() => User, user => user.ticketsAtendidos)
    @JoinTable({
        name: 'Atiende', 
        joinColumn: {
            name: 'Id_Ticket', 
            referencedColumnName: 'idTicket' 
        },
        inverseJoinColumn: {
            name: 'Id_Tecnico', 
            referencedColumnName: 'ci' 
        }
    })
    tecnicosAsignados: User[];

    @OneToMany(() => PagoTecnico, pago => pago.ticket)
    pagosTecnico: PagoTecnico[];
}