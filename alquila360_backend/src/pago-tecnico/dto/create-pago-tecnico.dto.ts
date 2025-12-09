// src/pagos-tecnico/dto/create-pago-tecnico.dto.ts
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PagoTecnicoEstado } from '../../entity/pagoTecnico.entity';

export class CreatePagoTecnicoDto {
  @IsInt()
  idTicket: number;

  @IsOptional()
  @IsInt()
  idTecnico?: number; // si no se envía, podemos usar el primer técnico asignado al ticket

  @IsOptional()
  @IsDateString()
  fecha?: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  @MaxLength(100)
  motivo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  metodoDePago?: string;

  @IsOptional()
  @IsEnum(PagoTecnicoEstado)
  estado?: PagoTecnicoEstado; // por defecto PENDIENTE
}
