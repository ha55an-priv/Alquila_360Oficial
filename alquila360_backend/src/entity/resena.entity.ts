import { Column, Entity,ManyToMany,JoinTable, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity"; 

@Entity('Reseña')
export class Resena {

    @PrimaryGeneratedColumn({ name: 'Id_Reseña' })
    idResena: number;

    
    @Column({ name: 'Id_Criticon' })
    idCriticon: number; 

    
    @ManyToOne(() => User, user => user.resenasCreadas)
    @JoinColumn({ name: 'Id_Criticon', referencedColumnName: 'ci' })
    criticon: User; 

    
    @Column({ type: 'int', nullable: true })
    calificacion: number | null; 

    @Column({ type: 'nvarchar', length: 300, nullable: true })
    descripcion: string | null;

    @Column({ name: 'Titulo', type: 'nvarchar', length: 100, nullable: true })
    titulo: string | null;

    @ManyToMany(() => User, user => user.resenasRecibidas)
    @JoinTable({
        name: 'Regaña', 
        joinColumn: {
            name: 'Id_Reseña', 
            referencedColumnName: 'idResena' 
        },
        inverseJoinColumn: {
            name: 'Id_Criticado',
            referencedColumnName: 'ci' 
        }
    })
    criticados: User[];
}