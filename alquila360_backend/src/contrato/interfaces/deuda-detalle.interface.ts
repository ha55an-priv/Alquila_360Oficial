

export interface CuotaDetalladaInterface {
    fechaVencimiento: Date;
    montoBase: number;
    multa: number;
    cubiertoPorAdelanto: number;
    deudaNeta: number;
    // Usamos string para el estado derivado ('Cubierto por Adelanto' o el estado del Enum)
    estadoActual: string; 
}