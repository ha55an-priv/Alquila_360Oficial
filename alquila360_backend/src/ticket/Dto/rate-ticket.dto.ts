import { IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class RateTicketDto {
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  comentarios?: string;
}
