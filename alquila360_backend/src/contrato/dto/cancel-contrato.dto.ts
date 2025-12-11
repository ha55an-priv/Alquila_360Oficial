import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelContratoDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  motivo?: string;
}