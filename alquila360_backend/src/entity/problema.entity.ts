import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { Ticket } from "./ticket.entity"; 

@Entity('Problema')
export class Problema {

    
    @PrimaryGeneratedColumn({ name: 'Id_Problema' })
    idProblema: number;

    @Column({ name: 'Nombre_Problema', type: 'nvarchar', length: 100, nullable: true })
    nombreProblema: string | null;

    @Column({ type: 'nvarchar', length: 20, nullable: true })
    prioridad: string | null;

   @ManyToMany(() => Ticket, ticket => ticket.problemas)
    tickets: Ticket[];

    @ManyToMany(() => Ticket, ticket => ticket.problemasEmergencia)
    ticketsEmergencia: Ticket[];
}