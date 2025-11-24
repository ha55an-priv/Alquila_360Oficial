import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // Esta función combina y resuelve clases de CSS (usando las librerías que instalaste)
  return twMerge(clsx(inputs));
}
