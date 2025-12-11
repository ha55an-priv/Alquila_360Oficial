

import { instance } from "../utils/axios.util";



interface LoginCredentials {
    ci: number;
    contrasena: string;
}

interface AuthResponse {
    token: string;
    message: string;
    user: any; // Puedes mejorar este tipo si tienes una interfaz User en el frontend
}
interface RegisterCredentials {
    ci: number;
    name: string;
    contrasena: string;
    roles?: number[]; // opcional, el backend ya asigna uno por defecto
}
interface RegisterResponse {
    message: string;
    user: any;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
        // La instancia de Axios configurada (instance)
        const response = await instance.post("/auth/login", credentials);
        const data: AuthResponse = response.data;
        
        // CRÍTICO: Almacenar el token para que el interceptor lo adjunte automáticamente
        if (data.token) {
            localStorage.setItem('authToken', data.token); // Usando 'authToken' como clave
        }

        return data;

    } catch (error) {
        // Re-lanzar el error para que el componente LoginPage.tsx lo capture 
        // y pueda mostrar el mensaje de error del backend (ej: "Contraseña incorrecta")
        throw error;
    }
};

export const register = async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
        const response = await instance.post("/auth/register", credentials);
        const data: RegisterResponse = response.data;
        return data;
    } catch (error) {
        // Deja que el componente maneje el error (como en login)
        throw error;
    }
};

/**
 * Elimina el token del LocalStorage para cerrar la sesión.
 */
export const logout = (): void => {
    localStorage.removeItem('authToken');
    // Adicionalmente, puedes redirigir al usuario aquí si es necesario
};