import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity('Rol')
export class Role {
    
    @PrimaryGeneratedColumn({ name: 'Id_Rol' })
    idRol: number;

    @Column({ name: 'Nombre_Rol', type: 'nvarchar', length: 100 })
    nombre: string;  // IMPORTANTEEEE!!

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}
