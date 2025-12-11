import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany} from "typeorm";
import { User } from "./user.entity"; 
import { Contrato } from "./contrato.entity";
import { Ticket } from "./ticket.entity";

export enum EstadoPropiedad {
  Libre = 'Libre',
  Rentado = 'Rentado',
}

@Entity('Propiedad')
export class Propiedad {

    @PrimaryGeneratedColumn({ name: 'Id_Propiedad' })
    idPropiedad: number;

    @ManyToMany(() => User, user => user.propiedades)
    propietarios: User[];

    @Column({ type: 'nvarchar', length: 200, nullable: true })
    descripcion: string | null;

    @Column({ type: 'nvarchar', length: 50, nullable: true })
    tipo: string | null;

    @Column({
  type: 'enum',
  enum: EstadoPropiedad,
  default: EstadoPropiedad.Libre,
})
estado: EstadoPropiedad;


    @Column({ type: 'nvarchar', length: 50, nullable: true })
    ciudad: string | null;

    @Column({ type: 'nvarchar', length: 100, nullable: true })
    calle: string | null;

    @Column({ name: 'Num_Viv', type: 'int', nullable: true })
    numViv: number | null; 

    @OneToMany(() => Contrato, contrato => contrato.propiedad)
    contratos: Contrato[];
    
    @OneToMany(() => Ticket, ticket => ticket.propiedad)
    tickets: Ticket[];
}