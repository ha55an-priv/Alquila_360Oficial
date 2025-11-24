import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity"; 

@Entity('Metodos_de_Pago') 
export class MetodoPago {

    
    @PrimaryColumn({ name: 'Id_Inquilino' })
    idInquilino: number; 

    @PrimaryColumn({ name: 'Metodo_de_Pago', type: 'nvarchar', length: 50 })
    metodo: string; 

    @ManyToOne(() => User, user => user.metodosPago)
    @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' }) // Enlaza Id_Inquilino a User.ci
    inquilino: User; 
}