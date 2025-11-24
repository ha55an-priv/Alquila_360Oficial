import { instance } from "../utils/axios.util"; 
import { isAxiosError } from "axios";
import { AdminProfile } from '@/app/interfaces/admin.interface';

const ADMIN_API_URL = '/admin/profile'; 

/**
 * Obtiene el perfil completo del Administrador actual.
 * @returns Una promesa que resuelve al objeto AdminProfile.
 */
export const getAdminProfile = async (): Promise<AdminProfile> => {
  try {
    // Simulación: Asumo que el endpoint devuelve el perfil del usuario autenticado
    const response = await instance.get<AdminProfile>(ADMIN_API_URL);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error al cargar el perfil del administrador.';
      throw new Error(errorMessage);
    }
    // Simulación de datos en caso de error de conexión (para desarrollo)
    console.warn("Error real al cargar el perfil. Usando datos simulados.");
    return {
        id: 'admin-123',
        ci: '10234567',
        fullName: 'Luis Antonio Morales',
        email: 'luis.morales@alquila360.com',
        contactPhone: '+591 77788899',
        birthDate: '1985-05-15',
        role: 'ADMINISTRADOR',
    } as AdminProfile;
  }
};