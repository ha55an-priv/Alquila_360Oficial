import { IsInt,IsISO8601, } from 'class-validator';


export class CuotaSeleccionadaDto {
    @IsInt()
    idInquilino: number;
    
    @IsInt()
    idPropiedad: number;

    @IsISO8601()
    fechaInicioContrato: string; 

    @IsISO8601()
    fechaPago: string; // Fecha de vencimiento de la cuota
}