import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Contrato } from "./contrato.entity"; 

export enum EstadoPago {
PENDIENTE = 'PENDIENTE',
VENCIDA = 'VENCIDA',
PAGADA = 'PAGADA',
PENDIENTE_VERIFICACION = 'PENDIENTE_VERIFICACION', 
REVERSADO = 'REVERSADO',
}


export enum PaymentMethod {
    EFECTIVO = 'EFECTIVO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    QR = 'QR',
}

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
    
    @Column({ name: 'Monto', type: 'decimal', precision: 10, scale: 2, nullable: false }) 
    monto: number;

    @Column({ 
        name: 'Monto_Pagado', 
        type: 'decimal', 
        precision: 10, 
        scale: 2, 
        nullable: true,
        default: 0 
    }) 
    // Nuevo campo: Almacena el monto real (base + multa + exceso) que el inquilino pagó.
    montoPagado: number | null;

    @Column({ 
        name: 'Fecha_Registro_Pago', 
        type: 'timestamp', // Usamos 'timestamp' para guardar fecha y hora precisas
        nullable: true // Es nulo hasta que la cuota sea PAGADA
    })
    fechaRegistroPago: Date | null;


    @Column({ type: 'varchar', nullable: true })
    rutaComprobante: string | null; 
    

     @Column({ type: 'varchar', length: 255, nullable: true }) // ⬅️ AGREGAR type: 'varchar'
    rutaFactura: string | null;

    @Column({ 
        name: 'Estado', 
        type: 'enum', 
        enum: EstadoPago, 
        default: EstadoPago.PENDIENTE // Define el valor por defecto
    })
    estado: EstadoPago;

    @Column({ name: 'Multa_Pagada', type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
    multaPagada: number | null; // El monto de la multa cobrada
    
    @ManyToOne(() => Contrato, contrato => contrato.pagos, {
    onDelete: 'CASCADE',
    })
    @JoinColumn([
        { name: 'Id_Inquilino', referencedColumnName: 'idInquilino' },
        { name: 'Id_Propiedad', referencedColumnName: 'idPropiedad' },
        { name: 'F_ini', referencedColumnName: 'fechaInicio' },
    ])
    contrato: Contrato;

    @Column({ 
        name: 'Metodo_de_Pago', 
        type: 'enum',          // Usa el tipo ENUM de la base de datos
        enum: PaymentMethod,   // Referencia al Enum de TypeScript
        nullable: true         // Sigue siendo nulo si la cuota no está pagada
    })
    metodoDePago: PaymentMethod | null;

    @Column({ 
        name: 'Referencia_Transaccion', 
        type: 'nvarchar', 
        length: 50, 
        nullable: true // Es opcional, ya que Efectivo no la necesita
    })
    referenciaTransaccion: string | null;


    @Column({ name: 'Motivo', type: 'nvarchar', length: 100, nullable: true })
    motivo: string | null;
}