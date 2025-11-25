import { Tecnico } from "@/app/interfaces/tecnico.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function getTecnicoById(id: number): Promise<Tecnico> {
  const response = await fetch(`${API_URL}/tecnico/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Error al obtener datos del técnico");
  }

  return response.json();
}
