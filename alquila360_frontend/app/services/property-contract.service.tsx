import { Contract } from "@/app/interfaces/property-contract.interface";

export const getOwnerContracts = async (): Promise<Contract[]> => {
  try {
    const response = await fetch("/api/contracts/owner");
    if (!response.ok) throw new Error("Error al obtener contratos");
    const data = await response.json();
    return data as Contract[];
  } catch (error) {
    console.error("Error en getOwnerContracts:", error);
    return [];
  }
};