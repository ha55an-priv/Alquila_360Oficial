import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity"; 

@Entity('Telefonos_Usuario') 
export class TelefonoUsuario {

    
    @PrimaryColumn({ name: 'Id_Usuario' })
    idUsuario: number; 

    @PrimaryColumn({ type: 'nvarchar', length: 20 })
    telefono: string;

    @ManyToOne(() => User, user => user.telefonos)
    @JoinColumn({ name: 'Id_Usuario', referencedColumnName: 'ci' }) 
    usuario: User; 
}