import { Column, Entity , OneToMany, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { User } from "./user.entity"; // Asume la ruta a la entidad Usuario
import { Propiedad } from "./propiedad.entity"; // Asume la ruta a la entidad Propiedad
import { PagoAlquiler } from "./pago_alquiler.entity";

@Entity('Contrato')
export class Contrato {

    
    @PrimaryColumn({ name: 'Id_Inquilino' })
    idInquilino: number; 
    
    @PrimaryColumn({ name: 'Id_Propiedad' })
    idPropiedad: number;

    
    @PrimaryColumn({ name: 'F_ini', type: 'date' })
    fechaInicio: Date; 

    @ManyToOne(() => User, user => user.contratosInquilino)
    @JoinColumn({ name: 'Id_Inquilino', referencedColumnName: 'ci' })
    inquilino: User;

    @ManyToOne(() => Propiedad, propiedad => propiedad.contratos)
    @JoinColumn({ name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' })
    propiedad: Propiedad;

    

    @Column({ name: 'Contrato_Explicacion', type: 'nvarchar', length: 300, nullable: true })
    explicacion: string | null;

    
    @Column({ name: 'Precio_mensual', type: 'decimal', precision: 10, scale: 2, nullable: false })
    precioMensual: number;

    @Column({ name: 'Adelanto', type: 'decimal', precision: 10, scale: 2, nullable: true })
    adelanto: number | null;
    
    @Column({ name: 'F_Fin', type: 'date' })
    fechaFin: Date;

    @Column({ name: 'Multa_Retraso', type: 'decimal', precision: 10, scale: 2, nullable: true })
    multaRetraso: number | null;

    @OneToMany(() => PagoAlquiler, pago => pago.contrato, {
        onDelete: 'CASCADE',
    })
    pagos: PagoAlquiler[];
}