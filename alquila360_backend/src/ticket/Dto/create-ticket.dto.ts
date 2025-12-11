import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { TicketPriority } from '../../entity/ticket.entity';

export class CreateTicketDto {
  @IsInt()
  @IsNotEmpty()
  idPropiedad: number;

  @IsInt()
  @IsNotEmpty()
  idInquilino: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  descripcion?: string;

  @IsOptional()
  @IsEnum(TicketPriority)
  prioridad?: TicketPriority;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  problemaIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  problemaEmergenciaIds?: number[];

  @IsOptional()
  @IsDateString()
  fechaReporte?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotoUrls?: string[];
}
