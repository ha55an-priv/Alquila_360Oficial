import { IsNumber, IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { TipoMulta, EstadoContrato } from 'src/entity/contrato.entity';

export class CreateContratoDto {
  @IsNumber() idInquilino: number;
  @IsNumber() idPropiedad: number;

  @IsDateString() fechaInicio: string;
  @IsOptional() @IsDateString() fechaFin?: string;

  @IsOptional() @IsString() explicacion?: string;

  @IsString() precioMensual: string;
  @IsOptional() @IsString() adelanto?: string;
  @IsString() garantia: string;

  @IsOptional() @IsEnum(TipoMulta) tipoMulta?: TipoMulta;
  @IsOptional() @IsString() multaRetraso?: string;

  @IsOptional() @IsEnum(EstadoContrato) estado?: EstadoContrato;
}