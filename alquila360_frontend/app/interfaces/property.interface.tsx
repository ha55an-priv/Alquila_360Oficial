// @/app/interfaces/property.interface.ts

// --- ENUMS Y TIPOS DEL BACKEND ---

export enum EstadoPropiedad {
  Libre = 'Libre',
  Rentado = 'Rentado',
}

export interface Image {
    id: number;
    url: string;
    order: number;
    propiedadId: number; // La FK que TypeORM usa
}

// --- 1. INTERFAZ PARA CREAR (El DTO que el frontend envía) ---

export interface NewProperty {
    // Campos del DTO (Todos son requeridos en el DTO, pero aquí definimos la estructura)
    descripcion: string;
    tipo: string;
    ciudad: string;
    calle: string;
    
    // Campos opcionales / numéricos (Type es necesario para que TypeORM lo reciba)
    numViv?: number | null; 
    
    // El 'estado' tiene un valor por defecto en el DTO, así que es opcional enviarlo
    estado?: EstadoPropiedad;
}

// --- 2. INTERFAZ PARA LA FUNCIÓN DE CREACIÓN (DTO + Files) ---

export interface NewPropertyWithImages {
    propertyData: NewProperty;
    images: File[]; // Los archivos seleccionados en el input
}


// --- 3. INTERFAZ DE RESPUESTA (Lo que el backend devuelve) ---

export interface Property {
    idPropiedad: number; // La clave primaria
    descripcion: string;
    tipo: string;
    estado: EstadoPropiedad;
    ciudad: string;
    calle: string;
    numViv: number | null;

    // Relaciones (para lectura)
    images: Image[]; // Array de las URLs de las imágenes
    propietarios: { id: number, /* ... otros campos de User */ }[]; 
    contratos: any[]; // Si tienes el contrato completo, tiparlo
    tickets: any[]; // Si tienes el ticket completo, tiparlo
}