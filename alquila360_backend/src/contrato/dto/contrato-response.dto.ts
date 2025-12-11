import { TipoMulta, EstadoContrato } from 'src/entity/contrato.entity';

export class ContratoResponseDto {
  idContrato: number;
  idInquilino: number;
  idPropiedad: number;

  fechaInicio: Date;
  fechaFin: Date | null;
  explicacion: string | null;

  precioMensual: string;
  adelanto: string | null;
  garantia: string;

  tipoMulta: TipoMulta;
  multaRetraso: string | null;
  estado: EstadoContrato;

  constructor(partial: Partial<ContratoResponseDto>) {
    Object.assign(this, partial);
  }
}