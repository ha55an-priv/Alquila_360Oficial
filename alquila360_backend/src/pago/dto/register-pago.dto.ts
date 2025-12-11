import { IsNotEmpty, IsNumber, IsString, IsDateString } from 'class-validator';

export class RegisterPaymentDto {
  @IsNotEmpty()
  @IsDateString()
  fechaPago: string;

  @IsNotEmpty()
  @IsString()
  metodoDePago: string;

  @IsString()
  motivo?: string;

  @IsNotEmpty()
  @IsNumber()
  montoPagado: number;
}
