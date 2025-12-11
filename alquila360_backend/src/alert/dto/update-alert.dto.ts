import { PartialType } from '@nestjs/mapped-types';
import { CreateAlertDto } from './create-alert.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoAlerta } from '../../entity/alerta.entity';

export class UpdateAlertDto extends PartialType(CreateAlertDto) {
  @IsEnum(EstadoAlerta)
  @IsOptional()
  estado?: EstadoAlerta;
}