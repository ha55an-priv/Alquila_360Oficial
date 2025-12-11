import { Property, NewProperty, NewPropertyWithImages } from "@/app/interfaces/property.interface";

// ----------------------------------------------------------------------
// Función Auxiliar para obtener el Token (Ajustar según dónde lo guardes)
// ----------------------------------------------------------------------
export const getAuthToken = (): string | null => {
  
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken'); 
    }
    return null;
};

// ----------------------------------------------------------------------
// 1. CREATE PROPERTY (POST) - No requiere token si no requiere propietario logueado
// ----------------------------------------------------------------------
export const createProperty = async ({ propertyData, images }: NewPropertyWithImages): Promise<Property | null> => {
    // Si tu endpoint POST también requiere autenticación, tendrías que añadir el token aquí.
    // Por ahora, lo dejamos sin token, asumiendo que el ID de prueba se usa para el dueño.
    try {
        const formData = new FormData();

        formData.append('descripcion', propertyData.descripcion);
        formData.append('tipo', propertyData.tipo);
        formData.append('ciudad', propertyData.ciudad);
        formData.append('calle', propertyData.calle);
        
        if (propertyData.numViv !== undefined && propertyData.numViv !== null) {
            formData.append('numViv', propertyData.numViv.toString());
        }
        
        images.forEach((file) => {
            formData.append('images', file); 
        });

        const response = await fetch("/api/properties", {
            method: "POST",
            body: formData, 
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || "Error al publicar la propiedad.");
        }
        
        return await response.json() as Property;
        
    } catch (error) {
        console.error("Error en createProperty:", error);
        throw error;
    }
};

const NESTJS_BASE_URL = 'http://localhost:3001';

export const getOwnerProperties = async (): Promise<Property[]> => {
    try {
        const token = getAuthToken();

        if (!token) {
            console.error("Token de autenticación no encontrado.");
            throw new Error("Acceso no autorizado."); 
            return []; 
        }
        await new Promise(resolve => setTimeout(resolve, 50));

        const response = await fetch(`${NESTJS_BASE_URL}/properties/owner`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            // Revisar si es error de autenticación 
            if (response.status === 401 || response.status === 403) {
                console.error("Acceso denegado o token inválido/expirado.");
            }
            // Intentar leer el error del backend si existe
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido.' }));
            throw new Error(errorData.message || "Error al obtener propiedades del dueño.");
        }
        
        const data = await response.json();
        return data as Property[];

    } catch (error) {
        console.error("Error en getOwnerProperties:", error);
        // Si el error es lanzado, el componente de UI debe capturarlo
        throw error; 
    }
};


export const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
        // Asumo que esta ruta NO requiere token para ser pública. 
        // Si requiere token, deberías agregar la misma lógica que getOwnerProperties
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error("Error al obtener propiedad");
        const data = await response.json();
        return data as Property;
    } catch (error) {
        console.error("Error en getPropertyById:", error);
        return null;
    }
};

export const deleteProperty = async (id: number): Promise<void> => {
    try {
        const token = getAuthToken();

        if (!token) {
            throw new Error("Acceso denegado: Token no encontrado.");
        }

        const response = await fetch(`/api/properties/${id}`, {
            method: "DELETE",
            headers: {
            
                'Authorization': `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.message || "Error al eliminar la propiedad.");
        }
    } catch (error) {
        console.error("Error en deleteProperty:", error);
        throw error;
    }
};