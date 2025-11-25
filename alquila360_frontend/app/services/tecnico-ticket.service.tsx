import { TicketTecnico } from "@/app/interfaces/tecnicoticket.interface";

const API_URL = "http://localhost:8080/api/tecnico/tickets";

export const obtenerTicketsAsignados = async (idTecnico: number): Promise<TicketTecnico[]> => {
  const res = await fetch(`${API_URL}/${idTecnico}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Error obteniendo los tickets del técnico.");
  }

  return res.json();
};
