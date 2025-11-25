import { OwnerProfile } from "@/app/interfaces/owner.interface";

export const getOwnerProfile = async (): Promise<OwnerProfile> => {
  try {
    const response = await fetch("/api/owner/profile"); // Ajusta la ruta según tu backend
    if (!response.ok) throw new Error("Error al obtener perfil");
    const data = await response.json();
    return data as OwnerProfile;
  } catch (error) {
    console.error("Error en getOwnerProfile:", error);
    return {
      ci: "",
      fullName: "",
      birthDate: "",
      phone: "",
      email: "",
      totalProperties: 0,
      activeContracts: 0,
      rating: 0,
      totalIncome: 0,
      rentedProperties: 0,
    };
  }
};