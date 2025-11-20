import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "./user.entity";

@Entity('Rol') 
export class Role {

    
    @PrimaryGeneratedColumn({ name: 'Id_Rol' }) 
    idRol: number; 

    @Column({ length: 50, nullable: false }) 
    nombre: string;

    // src/entities/Role.ts (Modificación)

// ...

@Column({ 
    length: 100, 
    nullable: true,
    type: 'varchar' // <-- ¡FUERZA EL TIPO SQL!
}) 
acceso: string | null; 

// ... 

    @Column({ 
    length: 50, 
    nullable: true,
    type: 'varchar' // <-- ¡Fuerza el tipo SQL para evitar inferencia!
}) 
categoria: string | null;

    @ManyToMany(() => User, user => user.roles)
    users: User[];
}