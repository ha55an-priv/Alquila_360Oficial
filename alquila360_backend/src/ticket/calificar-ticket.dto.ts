// src/ticket/calificar-ticket.dto.ts
import {
  IsInt,
  Max,
  Min,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CalificarTicketDto {
  @IsInt()
  @Min(1)
  @Max(5)
  calificacionTecnico: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comentarioCalificacion?: string;
}
