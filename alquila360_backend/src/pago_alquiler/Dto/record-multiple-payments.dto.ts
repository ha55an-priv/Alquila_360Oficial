import { Min, IsNumber, IsString,ValidateNested, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEnum,  } from 'class-validator';
import { PaymentMethod } from './metodo-pago.enum';
import { CuotaSeleccionadaDto } from './cuota-seleccionada.dto';

export class RecordMultiplePaymentsDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CuotaSeleccionadaDto)
    cuotas: CuotaSeleccionadaDto[]; 

    @IsNumber()
    @Min(0)
    montoPagadoTotal: number; 

    @IsEnum(PaymentMethod)
    metodoDePago: PaymentMethod; 

    @IsString()
    @IsOptional()
    motivo: string | null;

    @IsString()
    @IsOptional()
    referenciaTransaccion?: string;
    
    // NOTA: El archivo de comprobante se manejará directamente en el Controller.
}