import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer'; // <-- ¡Esta es la línea clave!


export class RegisterAdelantoDto {
  // Claves para identificar el contrato
  @IsNotEmpty()
  @IsNumber()
  idInquilino: number; 
  
  @IsNotEmpty()
  @IsNumber()
  idPropiedad: number;

  @IsNotEmpty()
  @IsDateString()
  fechaInicioContrato: Date; 
  
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  montoAdelanto: number; 
}