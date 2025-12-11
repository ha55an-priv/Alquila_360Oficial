// src/pago/dto/filter-pago-tecnico.dto.ts
import { IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { PagoTecnicoEstado } from '../../entity/pagoTecnico.entity';

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
