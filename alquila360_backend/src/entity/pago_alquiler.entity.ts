import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Contrato } from "./contrato.entity"; // Asegúrate de importar la entidad Contrato

@Entity('Pago_Alquiler')
export class PagoAlquiler {


    @PrimaryColumn({ name: 'Id_Inquilino' })
    idInquilino: number; 

    @PrimaryColumn({ name: 'Id_Propiedad' })
    idPropiedad: number;

    
    @PrimaryColumn({ name: 'F_ini', type: 'date' })
    fechaInicioContrato: Date; 
    
    @PrimaryColumn({ name: 'Fecha', type: 'date' })
    fechaPago: Date; 
    
    @PrimaryColumn({ name: 'Monto', type: 'decimal', precision: 10, scale: 2 })
    @Column({ name: 'Monto', type: 'decimal', precision: 10, scale: 2, nullable: false }) 
    monto: string;

    
    @ManyToOne(() => Contrato, contrato => contrato.pagos)
    @JoinColumn([
        { name: 'Id_Inquilino', referencedColumnName: 'idInquilino' },
        { name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' },
        { name: 'F_ini', referencedColumnName: 'fechaInicio' },
    ])
    contrato: Contrato;


    @Column({ name: 'Metodo_de_Pago', type: 'nvarchar', length: 50, nullable: true })
    metodoDePago: string | null;

    @Column({ name: 'Motivo', type: 'nvarchar', length: 100, nullable: true })
    motivo: string | null;
}