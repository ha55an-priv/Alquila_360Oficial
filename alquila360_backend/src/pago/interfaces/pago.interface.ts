export interface PaymentStats {
  total: number;
  porEstado: {
    PENDIENTE: number;
    PAGADO: number;
    VENCIDO: number;
  };
  totalPagado: number;
  totalPendiente: number;
  totalVencido: number;
  proximasVencer: number;
  vencidas: number;
  porcentajePagado: number;
}

export interface PaymentSummary {
  mes: number;
  anio: number;
  totalPagos: number;
  totalRecaudado: number;
  promedioPago: number;
}

export interface OverduePayment {
  idPago: number;
  idContrato: number;
  idInquilino: number;
  numeroCuota: number;
  montoTotal: string;
  diasVencidos: number;
  multaAcumulada: string;
  inquilinoNombre: string;
  propiedadDireccion: string;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  idContrato?: number;
  idInquilino?: number;
  estado?: string;
  fechaVencimientoDesde?: Date;
  fechaVencimientoHasta?: Date;
  fechaPagoDesde?: Date;
  fechaPagoHasta?: Date;
  sort?: string;
  order?: 'asc' | 'desc';
}