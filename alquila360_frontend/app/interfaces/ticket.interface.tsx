export interface Ticket {
  id: string;
  ticketId: string; // ID visible, ej: T-2024-001
  property: {
    name: string;
    address: string;
  };
  tenant: {
    id: string;
    fullName: string;
  };
  problemDescription: string;
  technicalAssistance: {
    assignedTech: string; // Nombre del técnico asignado
    rating: number | null; // Calificación de 1 a 5, o null si no ha sido calificado
    review: string | null;
  };
  priority: TicketPriority;
  status: TicketStatus;
  creationDate: string; // Formato ISO, ej: '2024-10-25'
  lastUpdateDate: string;
}

/**
 * Define la estructura de los parámetros de búsqueda y filtro para tickets.
 */
export interface TicketFilterParams {
    searchQuery: string;
    month: string; 
    year: string;
    propertyType: string; // Para filtrar por tipo de inmueble asociado
    status: string; // 'all', 'Pendiente', 'Finalizado', etc.
    priority: string; // 'all', 'Baja', 'Media', 'Alta'
    sortOrder: 'recent' | 'old';
}

// Interfaz para los datos que se envían al backend
export interface CreateTicketPayload {
  nombrePropiedadId: string; // Asumimos que la propiedad se identifica por ID
  nombreDelProblema: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  fotos?: File[]; // Si manejas la subida de archivos
}

// Interfaz para la respuesta que esperamos recibir
export interface TicketResponse {
  id: number;
  numeroTicket: string;
  nombreInquilino: string;
  nombrePropiedad: string;
  nombreDelProblema: string;
  estado: 'Abierto' | 'En Progreso' | 'Cerrado';
  fechaCreacion: string; // En formato de fecha/hora
  prioridad: 'baja' | 'media' | 'alta';
}

export type TicketPriority = 'ALTA' | 'MEDIA' | 'BAJA';
export type TicketStatus = 'ABIERTO' | 'EN PROGRESO' | 'CERRADO' | 'PENDIENTE';

/**
 * Interfaz principal para un objeto Ticket.
 */
export interface Ticket {
  id: string;
  ticketNumber: number;
  propertyName: string;
  type: string; // Ej: TÉCNICO, ADMINISTRATIVO
  priority: TicketPriority;
  status: TicketStatus;
  rating: number; // Calificación de 0 a 5
  description: string;
  createdAt: Date;
  updatedAt?: Date; // Fecha de última actualización
  resolvedAt?: Date; // Fecha de resolución del ticket
  reviewerId?: string; // ID del usuario que dejó la reseña
  reviewText?: string; // Texto de la reseña
  // Propiedades adicionales necesarias para la vista (ej. imágenes asociadas)
  photos?: string[]; // URLs de las fotos del ticket
}

// Interfaz para la respuesta de la lista de tickets (si viene paginada, etc.)
export interface TicketListResponse {
  tickets: Ticket[];
  totalTickets: number;
}

/**
 * Interfaz para los datos de la reseña que se envían al backend.
 */
export interface TicketReviewPayload {
  rating: number; // Calificación de 1 a 5
  reviewText?: string; // Texto opcional de la reseña
}



/**
 * Define la estructura de un Ticket de Soporte/Mantenimiento.
 */
