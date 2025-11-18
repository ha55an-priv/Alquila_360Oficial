import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Emergencia {
    @PrimaryGeneratedColumn()
    Id_Emergencia: number;

    @Column()
    Id_Problema: number;

    @Column({ type: "nvarchar", length: 50 })
    Nombre_Emergencia: string;
}
