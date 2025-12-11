import { IsInt, IsOptional, IsString, MaxLength, IsDateString, IsArray } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  idPropiedad: number;

  @IsInt()
  idInquilino: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  descripcion?: string;

  @IsDateString()
  fechaReporte: string;

  @IsOptional()
  @IsArray()
  problemas?: number[];
}
