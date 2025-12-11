import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class CreatePagoTecnicoDto {
  @IsNotEmpty()
  @IsNumber()
  idTicket: number;

  @IsNotEmpty()
  @IsNumber()
  idTecnico: number;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsString()
  motivo?: string;

  @IsString()
  metodoDePago?: string;

  @IsNumber()
  monto?: number;
}
