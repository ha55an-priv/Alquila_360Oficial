import { TenantPayment } from "@/app/interfaces/tenant-payment.interface";

export const getTenantPayments = async (): Promise<TenantPayment[]> => {
  try {
    const response = await fetch("/api/payments/tenant");
    if (!response.ok) throw new Error("Error al obtener pagos del inquilino");
    const data = await response.json();
    return data as TenantPayment[];
  } catch (error) {
    console.error("Error en getTenantPayments:", error);
    return [];
  }
};