import { IsNumber, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class IdentificadorCuotaDto {
    @IsNotEmpty()
    @IsNumber()
    idInquilino: number;

    @IsNotEmpty()
    @IsNumber()
    idPropiedad: number;

    @IsNotEmpty()
    @IsDateString()
    fechaInicioContrato: string; // La fecha de inicio del contrato (clave única)
    
    @IsNotEmpty()
    @IsDateString()
    fechaPago: string; // La fecha de la cuota a pagar (clave única)
}