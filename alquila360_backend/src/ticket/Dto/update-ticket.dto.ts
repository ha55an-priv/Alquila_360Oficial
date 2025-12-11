  import { PartialType } from '@nestjs/mapped-types';
  import { CreateTicketDto } from './create-ticket.dto';
  import { TicketStatus, TicketPriority } from '../../entity/ticket.entity';
  import { IsOptional, IsEnum, IsDateString, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

  export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus)
    estado?: TicketStatus;

    @IsOptional()
    @IsEnum(TicketPriority)
    prioridad?: TicketPriority;

    @IsOptional()
    @IsDateString()
    fechaReporte?: string;

    @IsOptional()
    @IsDateString()
    fechaCierre?: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    problemaIds?: number[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    problemaEmergenciaIds?: number[];

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    fotoUrls?: string[];

    @IsOptional()
    calificacionTecnico?: number;

    @IsOptional()
    comentarioCalificacion?: string;
  }