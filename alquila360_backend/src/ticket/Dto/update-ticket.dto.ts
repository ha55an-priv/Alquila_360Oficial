import { IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  descripcion?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsDateString()
  fechaCierre?: string | null;
}
