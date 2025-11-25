export interface TicketTecnico {
  id: number;
  propiedad: string;
  tecnico: string;
  prioridad: string;
  estado: string;
  calificacion: number; // 1 a 5 estrellas
  descripcion: string;
  color: string; // "red", "orange", "green"
}
