import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateContratoDto {

@IsOptional()
  @IsString({ message: 'La explicación debe ser texto.' })
  explicacion?: string; // Corresponde a 'Contrato_Explicacion'
  
  @IsOptional()
  @IsNumber({}, { message: 'El precio mensual debe ser un número.' })
  @Type(() => Number) 
  precioMensual?: number; // Corresponde a 'Precio_mensual'

  @IsOptional()
  @IsNumber({}, { message: 'El adelanto debe ser un número.' })
  @Type(() => Number) 
  adelanto?: number; // Corresponde a 'Adelanto'

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser un formato de fecha válido.' })
  fechaFin?: Date; // Corresponde a 'F_Fin'

  @IsOptional()
  @IsNumber({}, { message: 'La multa debe ser un número.' })
  @Type(() => Number)
  multaRetraso?: number; // Este valor solo se actualizaría si la regla del 1% diario cambia a un valor fijo.
}