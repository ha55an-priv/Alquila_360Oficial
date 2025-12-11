import { IsOptional, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { TicketStatus, TicketPriority } from '../../entity/ticket.entity';

export class FilterTicketDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  idPropiedad?: number;

  @IsOptional()
  @IsInt()
  idInquilino?: number;

  @IsOptional()
  @IsEnum(TicketStatus)
  estado?: TicketStatus;

  @IsOptional()
  @IsEnum(TicketPriority)
  prioridad?: TicketPriority;

  @IsOptional()
  @IsDateString()
  fechaReporteDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaReporteHasta?: string;

  @IsOptional()
  @IsDateString()
  fechaCierreDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaCierreHasta?: string;

  @IsOptional()
  @IsInt()
  idTecnico?: number;

  @IsOptional()
  @IsInt()
  idProblema?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';
}