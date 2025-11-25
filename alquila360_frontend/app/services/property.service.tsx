import { Property, NewProperty } from "@/app/interfaces/property.interface";

export const getOwnerProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch("/api/properties/owner");
    if (!response.ok) throw new Error("Error al obtener propiedades");
    const data = await response.json();
    return data as Property[];
  } catch (error) {
    console.error("Error en getOwnerProperties:", error);
    return [];
  }
};

export const createProperty = async (property: NewProperty): Promise<void> => {
  try {
    const response = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(property),
    });

    if (!response.ok) {
      throw new Error("Error al publicar la propiedad");
    }
  } catch (error) {
    console.error("Error en createProperty:", error);
  }
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const response = await fetch(`/api/properties/${id}`);
    if (!response.ok) throw new Error("Error al obtener propiedad");
    const data = await response.json();
    return data as Property;
  } catch (error) {
    console.error("Error en getPropertyById:", error);
    return null;
  }
};