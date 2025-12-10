import { instance } from "../utils/axios.util";
import { isAxiosError } from "axios";

interface ContractData {
  propertyId: number;
  tenantId: number;
  price: number;
  startDate: string;
  endDate: string;
}

interface PaymentData {
  amount: number;
  date: string;
  method: string;
}

interface ContractResponse {
  id: number;
  contractId: string;
  property: any;
  tenant: any;
  owner: any;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: string;
  documentUrl?: string;
}

const ContrService = {
  getAll: async (): Promise<ContractResponse[]> => {
    try {
      const response = await instance.get<ContractResponse[]>("/contratos");
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al obtener contratos";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al obtener contratos");
    }
  },

  getById: async (id: number): Promise<ContractResponse> => {
    try {
      const response = await instance.get<ContractResponse>(`/contratos/${id}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al obtener el contrato";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al obtener el contrato");
    }
  },

  create: async (data: ContractData): Promise<ContractResponse> => {
    try {
      const response = await instance.post<ContractResponse>("/contratos", data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al crear el contrato";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al crear el contrato");
    }
  },

  registrarPago: async (idPago: number, data: PaymentData): Promise<any> => {
    try {
      const response = await instance.post(`/contratos/pagos/${idPago}/registrar`, data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al registrar el pago";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al registrar el pago");
    }
  },

  cerrarContrato: async (id: number): Promise<any> => {
    try {
      const response = await instance.post(`/contratos/${id}/cerrar`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al cerrar el contrato";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al cerrar el contrato");
    }
  }
};

export default ContrService;
