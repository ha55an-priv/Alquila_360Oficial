import { TenantContract } from "@/app/interfaces/tenant-contract.interface";

export const getTenantContracts = async (): Promise<TenantContract[]> => {
  try {
    const response = await fetch("/api/contracts/tenant");
    if (!response.ok) throw new Error("Error al obtener contratos del inquilino");
    const data = await response.json();
    return data as TenantContract[];
  } catch (error) {
    console.error("Error en getTenantContracts:", error);
    return [];
  }
};

import { TenantContractDetail } from "@/app/interfaces/tenant-contract.interface";

export const getTenantContractById = async (id: string): Promise<TenantContractDetail | null> => {
  try {
    const response = await fetch(`/api/contracts/tenant/${id}`);
    if (!response.ok) throw new Error("Error al obtener contrato");
    const data = await response.json();
    return data as TenantContractDetail;
  } catch (error) {
    console.error("Error en getTenantContractById:", error);
    return null;
  }
};