import { IsNotEmpty, IsEnum, IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
import { TipoAlerta, EstadoAlerta } from '../../entity/alerta.entity';

export class CreateAlertDto {
  @IsNumber()
  idUsuario: number;

  @IsEnum(TipoAlerta)
  tipo: TipoAlerta;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  mensaje: string;

  @IsEnum(EstadoAlerta)
  @IsOptional()
  estado?: EstadoAlerta;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  entidadRelacionada?: string;

  @IsNumber()
  @IsOptional()
  idEntidadRelacionada?: number;
}