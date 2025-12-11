
import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEnum,  } from 'class-validator';
import { PaymentMethod } from './metodo-pago.enum';

export class RecordPaymentDto {  
  // --- IDENTIFICADORES DE LA CUOTA A PAGAR (Clave Compuesta) ---
  
  @IsNotEmpty()
  @IsNumber({}, { message: 'ID de Inquilino debe ser un número.' })
  idInquilino: number; 
  
  @IsNotEmpty()
  @IsNumber({}, { message: 'ID de Propiedad debe ser un número.' })
  idPropiedad: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'Fecha de inicio de contrato inválida.' })
  fechaInicioContrato: string; // F_ini del Contrato
  
  @IsNotEmpty()
  @IsDateString({}, { message: 'Fecha de cuota inválida.' })
  fechaPago: string;
  
  // --- DETALLES DEL PAGO REAL ---
  
  @IsOptional()
    @IsString({ message: 'La referencia de pago debe ser texto.' })
    referenciaTransaccion: string;
  
  @IsNotEmpty({ message: 'El monto pagado es obligatorio.' })
  @IsNumber({}, { message: 'Monto pagado debe ser un número.' })
  @Type(() => Number) // Para asegurar que se convierte de string a number
  montoPagado: number; 
  
  @IsNotEmpty({ message: 'El método de pago es obligatorio.' })
  @IsEnum(PaymentMethod, { message: 'Método de pago inválido.' }) 
  metodoDePago: PaymentMethod;
  
  @IsOptional()
  @IsString()
  motivo: string; 
}