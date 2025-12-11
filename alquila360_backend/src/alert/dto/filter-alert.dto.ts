import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EstadoAlerta, TipoAlerta } from '../../entity/alerta.entity';

export class FilterAlertDto {
  @IsOptional()
  @IsNumber()
  idUsuario?: number;

  @IsOptional()
  @IsEnum(TipoAlerta)
  tipo?: TipoAlerta;

  @IsOptional()
  @IsEnum(EstadoAlerta)
  estado?: EstadoAlerta;
}