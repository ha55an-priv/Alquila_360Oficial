import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { EstadoCuota } from '../../entity/pago_alquiler.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  idContrato: number;

  @IsNotEmpty()
  @IsNumber()
  numeroCuota: number;

  @IsNotEmpty()
  @IsDateString()
  fechaVencimiento: string;

  @IsNotEmpty()
  @IsString()
  montoBase: string;

  @IsOptional()
  @IsEnum(EstadoCuota)
  estado?: EstadoCuota;

  @IsOptional()
  @IsString()
  metodoDePago?: string;

  @IsOptional()
  @IsString()
  motivo?: string;
}
