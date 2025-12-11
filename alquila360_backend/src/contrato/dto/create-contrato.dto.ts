import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoMulta, EstadoContrato } from 'src/entity/contrato.entity';

export class CreateContractDto {
  @IsNumber()
  @IsNotEmpty()
  idInquilino: number;

  @IsNumber()
  @IsNotEmpty()
  idPropiedad: number;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @IsString()
  @IsOptional()
  explicacion?: string;


  @IsString()
  @IsNotEmpty()
  precioMensual: string;

  @IsString()
  @IsOptional()
  adelanto?: string;

  @IsString()
  @IsNotEmpty()
  garantia: string;

  @IsEnum(TipoMulta)
  @IsNotEmpty()
  tipoMulta: TipoMulta;

  @IsString()
  @IsOptional()
  multaRetraso?: string;

  @IsEnum(EstadoContrato)
  @IsOptional()
  estado?: EstadoContrato;
}