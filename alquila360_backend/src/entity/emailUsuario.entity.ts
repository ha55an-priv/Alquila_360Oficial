import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity"; 

@Entity('Emails_Usuario')
export class EmailUsuario {

    
    @PrimaryColumn({ name: 'Id_Usuario' })
    idUsuario: number; 

    
    @PrimaryColumn({ type: 'nvarchar', length: 100 }) 
    email: string;

    
    @ManyToOne(() => User, user => user.emails)
    @JoinColumn({ name: 'Id_Usuario', referencedColumnName: 'ci' }) // Enlaza Id_Usuario a User.ci
    usuario: User; 
}