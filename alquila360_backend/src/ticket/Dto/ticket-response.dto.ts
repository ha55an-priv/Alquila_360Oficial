import { TicketStatus, TicketPriority } from '../../entity/ticket.entity';

export class TicketResponseDto {
  idTicket: number;
  idPropiedad: number;
  idInquilino: number;
  descripcion: string | null;
  fechaReporte: Date;
  fechaCierre: Date | null;
  prioridad: TicketPriority;
  estado: TicketStatus;
  calificacionTecnico: number | null;
  comentarioCalificacion: string | null;

  propiedad: {
    idPropiedad: number;
    descripcion: string | null;
    direccion?: string;
  };

  inquilino: {
    ci: number;
    name: string;
    telefonos?: Array<{ telefono: string }>;
    emails?: Array<{ email: string }>;
  };

  tecnicosAsignados: Array<{ ci: number; name: string }>;

  problemas: Array<{ idProblema: number; nombreProblema: string | null; prioridad: string | null }>;
  problemasEmergencia: Array<{ idProblema: number; nombreProblema: string | null; prioridad: string | null }>;

  fotos: Array<{ id: number; url: string; filename?: string; uploadedAt: Date }>;

  estadisticas: {
    tiempoResolucionHoras: number | null;
    tiempoTranscurridoHoras: number;
    asignado: boolean;
    tieneFotos: boolean;
    calificado: boolean;
    diasAbierto: number;
  };
}
