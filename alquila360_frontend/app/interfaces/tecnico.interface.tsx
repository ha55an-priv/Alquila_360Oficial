export interface Tecnico {
  id: number;
  ci: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  contacto: string;
  email: string;
  calificacion: number; // del 1 al 5
  ticketsAsignados: number;
}
