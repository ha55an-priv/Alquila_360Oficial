export class CreateTicketDto {
  Id_Propiedad: number;
  Id_Inquilino: number;
  Descripcion?: string;
  Fecha_Reporte?: string | Date;
  Estado?: string;
  Fotos?: string[];
}

export class UpdateTicketDto {
  Descripcion?: string;
  Estado?: string;
  Fecha_Resolucion?: string | Date;
  Fotos?: string[];
}
