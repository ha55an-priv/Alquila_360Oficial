import { TenantProfile } from "@/app/interfaces/tenant.interface";

export const getTenantProfile = async (): Promise<TenantProfile> => {
  try {
    const response = await fetch("/api/tenant/profile");
    if (!response.ok) throw new Error("Error al obtener perfil del inquilino");
    const data = await response.json();
    return data as TenantProfile;
  } catch (error) {
    console.error("Error en getTenantProfile:", error);
    return {
      ci: "",
      fullName: "",
      birthDate: "",
      phone: "",
      email: "",
      finishedContracts: 0,
      rentedProperties: 0,
      pendingPayments: 0,
      openTickets: 0,
      paymentMethod: "No registrado",
      paymentStatus: "Sin estado",
    };
  }
};