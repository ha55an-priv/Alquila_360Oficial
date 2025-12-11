// src/payments/dto/filter-payment.dto.ts
import { IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { EstadoCuota } from '../../entity/pago_alquiler.entity';
import { PagoTecnicoEstado } from '../../entity/pagoTecnico.entity';

export class FilterPaymentDto {
  @IsOptional()
  @IsArray()
  @IsEnum(EstadoCuota, { each: true })
  estado?: EstadoCuota[];

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}

export class FilterPagoTecnicoDto {
  @IsOptional()
  @IsArray()
  @IsEnum(PagoTecnicoEstado, { each: true })
  estado?: PagoTecnicoEstado[];

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
