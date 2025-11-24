import { Property } from "../interfaces/Property";

const API_URL = "http://localhost:3001/properties";

export async function getAllProperties(): Promise<Property[]> {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getPropertyById(id: number): Promise<Property> {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createProperty(property: Property): Promise<Property> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });
  return res.json();
}
