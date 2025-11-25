import { Column, Entity, PrimaryColumn,ManyToMany,OneToMany, JoinTable } from "typeorm"; // ¡Cambiado a PrimaryColumn!
import { Role } from "./rol.entity";
import { TelefonoUsuario } from "./telefonoUsuario.entity";
import { EmailUsuario } from "./emailUsuario.entity";
import { Propiedad } from "./propiedad.entity";
import { Contrato } from "./contrato.entity";
import { MetodoPago } from "./metodoPago.entity";
import { Ticket } from "./ticket.entity";
import { PagoTecnico } from "./pagoTecnico.entity";
import { Resena } from "./resena.entity";

@Entity()
export class User {
    
    @PrimaryColumn() 
    ci: number; 

    @Column({ length: 100 }) 
    name: string;

    @Column({ name: 'fecha_nacimiento', type: 'date', nullable: true })
fechaNacimiento: Date | null;

    @Column({ length: 100 }) 
    contrasena: string;
    
    @Column({ type: "boolean", default: true }) 
    activacion: boolean; 

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({
        name: 'Usuario_Rol', 
        joinColumn: {
            name: 'Id_Usuario', 
            referencedColumnName: 'ci' 
        },
        inverseJoinColumn: {
            name: 'Id_Rol', 
            referencedColumnName: 'idRol' 
        }
    })
    roles: Role[];

    @OneToMany(() => TelefonoUsuario, telefono => telefono.usuario)
    telefonos: TelefonoUsuario[];

    @OneToMany(() => EmailUsuario, email => email.usuario)
    emails: EmailUsuario[];

    @ManyToMany(() => Propiedad, propiedad => propiedad.propietarios)
    @JoinTable({
        name: 'Posee', 
        joinColumn: {
            name: 'Id_Propietario', 
            referencedColumnName: 'ci' 
        },
        inverseJoinColumn: {
            name: 'Id_Propiedad', 
            referencedColumnName: 'idPropiedad' 
        }
    })
    propiedades: Propiedad[];
    @OneToMany(() => Contrato, contrato => contrato.inquilino)
    contratosInquilino: Contrato[];

    @OneToMany(() => MetodoPago, metodo => metodo.inquilino)
    metodosPago: MetodoPago[];

    @OneToMany(() => Ticket, ticket => ticket.inquilino)
    ticketsReportados: Ticket[];

    @ManyToMany(() => Ticket, ticket => ticket.tecnicosAsignados)
    ticketsAtendidos: Ticket[];

    @OneToMany(() => PagoTecnico, pago => pago.tecnico)
    pagosRecibidos: PagoTecnico[];

    @OneToMany(() => Resena, resena => resena.criticon)
    resenasCreadas: Resena[];

    @ManyToMany(() => Resena, resena => resena.criticados)
    resenasRecibidas: Resena[];
}