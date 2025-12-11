  import { IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';
  import { PagoTecnicoEstado } from '../../entity/pagoTecnico.entity';

  export class RegisterPagoTecnicoDto {
    @IsNotEmpty()
    @IsDateString()
    fechaPago: string;

    @IsNotEmpty()
    @IsString()
    metodoDePago: string;

    @IsString()
    motivo?: string;

    estado?: PagoTecnicoEstado;

    @IsNumber()
    monto?: number;
  }
