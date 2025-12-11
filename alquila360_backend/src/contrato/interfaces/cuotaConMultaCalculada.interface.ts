import { PagoAlquiler, EstadoPago } from 'src/entity/pago_alquiler.entity'; 

export interface CuotaConMultaCalculada extends PagoAlquiler {
    multaCalculada: number;
    montoTotal: number; // Monto base + multa
    estadoCalculado: EstadoPago | 'PAGADA'; 
}