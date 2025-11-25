export interface AdminProfile {
  id: string;
  ci: string; // Cédula de Identidad
  fullName: string;
  email: string;
  contactPhone: string;
  birthDate: string; // Se puede usar 'string' para una fecha ISO simple o 'Date'
  role: 'ADMINISTRADOR';
  // Puedes añadir más campos como dirección, etc.
}

/**
 * Interfaz para la respuesta del backend.
 */
export interface AdminProfileResponse {
    profile: AdminProfile;
}