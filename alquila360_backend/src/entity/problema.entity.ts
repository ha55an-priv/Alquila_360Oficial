import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Problema {
    @PrimaryGeneratedColumn()
    Id_Problema: number;

    @Column({ type: "nvarchar", length: 200 })
    Nombre_Problema: string;
}
