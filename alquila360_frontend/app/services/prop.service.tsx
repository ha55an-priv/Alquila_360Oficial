import { instance } from "../utils/axios.util";
import { isAxiosError } from "axios";

interface PropertyData {
  name: string;
  type: string;
  address: string;
  price?: number;
  description?: string;
}

interface PropertyResponse {
  id: number;
  name: string;
  type: string;
  address: string;
  price?: number;
  description?: string;
}

const PropService = {
  getAll: async (): Promise<PropertyResponse[]> => {
    try {
      const response = await instance.get<PropertyResponse[]>("/property");
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al obtener propiedades";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al obtener propiedades");
    }
  },

  getById: async (id: number): Promise<PropertyResponse> => {
    try {
      const response = await instance.get<PropertyResponse>(`/property/${id}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al obtener la propiedad";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al obtener la propiedad");
    }
  },

  create: async (data: PropertyData): Promise<PropertyResponse> => {
    try {
      const response = await instance.post<PropertyResponse>("/property", data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al crear la propiedad";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al crear la propiedad");
    }
  }
};

export default PropService;
