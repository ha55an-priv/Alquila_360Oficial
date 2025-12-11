import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContratoDto {
  
  // --- CLAVE PRIMARIA COMPUESTA (REQUERIDOS PARA LA ÚNICIDAD DEL CONTRATO) ---
  
  @IsNotEmpty({ message: 'El ID del Inquilino es obligatorio.' })
  @IsNumber({}, { message: 'El ID del Inquilino debe ser un número.' })
  idInquilino: number; 
  
  @IsNotEmpty({ message: 'El ID de la Propiedad es obligatorio.' })
  @IsNumber({}, { message: 'El ID de la Propiedad debe ser un número.' })
  idPropiedad: number;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDateString({}, { message: 'La fecha de inicio debe ser un formato de fecha válido.' })
  fechaInicio: Date; // Corresponde a 'F_ini'
  
  // --- DATOS DEL CONTRATO ---

  @IsNotEmpty({ message: 'El precio mensual es obligatorio.' })
  @IsNumber({}, { message: 'El precio mensual debe ser un número.' })
  // Usamos @Type para asegurar que el valor se maneje como un número, aunque llegue como string/json.
  @Type(() => Number) 
  precioMensual: number; // Corresponde a 'Precio_mensual'

  @IsOptional()
  @IsString({ message: 'La explicación debe ser texto.' })
  explicacion: string; // Corresponde a 'Contrato_Explicacion'
  
  @IsOptional()
  @IsNumber({}, { message: 'El adelanto debe ser un número.' })
  @Type(() => Number) 
  adelanto: number; // Corresponde a 'Adelanto'

  @IsNotEmpty()
  @IsDateString({}, { message: 'La fecha de fin debe ser un formato de fecha válido.' })
  fechaFin: Date; // Corresponde a 'F_Fin'

  // El campo Multa_Retraso (1% diario) es una regla de negocio y no un dato de entrada,
  // por lo que NO DEBE incluirse en el DTO de creación. Se usa en los cálculos del Service.
}