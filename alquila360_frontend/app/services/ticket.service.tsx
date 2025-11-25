import { instance } from "../utils/axios.util"; 
import { isAxiosError } from "axios";
import { CreateTicketPayload, TicketResponse, TicketListResponse, Ticket, TicketReviewPayload } from '@/app/interfaces/ticket.interface'; 

const TICKET_API_URL = '/tickets'; 

export const createTicket = async (
  payload: CreateTicketPayload
): Promise<TicketResponse> => {
  try {
    const response = await instance.post<TicketResponse>(
      TICKET_API_URL, 
      payload
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error al crear el ticket. Revisa la conexión o el token.';
      throw new Error(errorMessage);
    }
    throw new Error('Ocurrió un error inesperado al conectar con el servicio.');
  }
};

export const fetchUserTickets = async (): Promise<TicketListResponse> => {
  try {
    const response = await instance.get<TicketListResponse>(`${TICKET_API_URL}/mine`); 
    // Asegurarse de que las fechas se conviertan a objetos Date si es necesario
    response.data.tickets = response.data.tickets.map(ticket => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt),
      updatedAt: ticket.updatedAt ? new Date(ticket.updatedAt) : undefined,
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
    }));
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error al cargar los tickets.';
      throw new Error(errorMessage);
    }
    throw new Error('Ocurrió un error inesperado al obtener la lista de tickets.');
  }
};

/**
 * Obtiene los detalles de un ticket específico por su ID.
 * @param id El ID del ticket a buscar.
 * @returns Una promesa que resuelve al objeto Ticket.
 */
export const getTicketById = async (id: string): Promise<Ticket> => {
  try {
    const response = await instance.get<Ticket>(`${TICKET_API_URL}/${id}`);
    const ticket = response.data;
    // Convertir fechas a objetos Date
    ticket.createdAt = new Date(ticket.createdAt);
    ticket.updatedAt = ticket.updatedAt ? new Date(ticket.updatedAt) : undefined;
    ticket.resolvedAt = ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined;
    return ticket;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || `Error al obtener el ticket ${id}.`;
      throw new Error(errorMessage);
    }
    throw new Error('Ocurrió un error inesperado al conectar con el servicio.');
  }
};

/**
 * Envía una reseña y calificación para un ticket específico.
 * @param id El ID del ticket.
 * @param payload Los datos de la reseña (rating y reviewText).
 * @returns Una promesa que resuelve al objeto Ticket actualizado.
 */
export const submitTicketReview = async (id: string, payload: TicketReviewPayload): Promise<Ticket> => {
  try {
    // Asumo que el endpoint para reseñas es PATCH /tickets/{id}/review
    const response = await instance.patch<Ticket>(`${TICKET_API_URL}/${id}/review`, payload);
    const updatedTicket = response.data;
    // Convertir fechas a objetos Date
    updatedTicket.createdAt = new Date(updatedTicket.createdAt);
    updatedTicket.updatedAt = updatedTicket.updatedAt ? new Date(updatedTicket.updatedAt) : undefined;
    updatedTicket.resolvedAt = updatedTicket.resolvedAt ? new Date(updatedTicket.resolvedAt) : undefined;
    return updatedTicket;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || `Error al enviar la reseña para el ticket ${id}.`;
      throw new Error(errorMessage);
    }
    throw new Error('Ocurrió un error inesperado al enviar la reseña.');
  }
};