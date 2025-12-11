import { EstadoCuota } from 'src/entity/pago_alquiler.entity';

export class PaymentResponseDto {
  idPago: number;
  idContrato: number;
  numeroCuota: number;
  fechaVencimiento: Date;
  fechaPago: Date | null;
  montoBase: string;
  multaAplicada: string | null;
  montoTotal: string;
  estado: EstadoCuota;
  metodoDePago: string | null;
  motivo: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Información del contrato relacionado
  contrato: {
    idContrato: number;
    idInquilino: number;
    propiedad: {
      idPropiedad: number;
      direccion?: string;
    };
  };

  // Información del inquilino
  inquilino: {
    ci: number;
    name: string;
  };

  // Estadísticas de la cuota
  estadisticas: {
    diasVencidos: number;
    multaDiaria: string;
    totalDiasMulta: number;
    porcentajeMulta: number;
  };
}