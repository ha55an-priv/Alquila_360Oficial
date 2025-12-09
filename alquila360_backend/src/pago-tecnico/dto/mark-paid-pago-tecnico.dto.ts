// src/pagos-tecnico/dto/mark-paid-pago-tecnico.dto.ts
import { IsInt, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class MarkPaidPagoTecnicoDto {
  @IsInt()
  idTicket: number;

  @IsDateString()
  fecha: string; // misma fecha con la que se registró el pago

  @IsOptional()
  @IsString()
  @MaxLength(50)
  metodoDePago?: string;
}
