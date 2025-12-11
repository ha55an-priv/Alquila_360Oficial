import { AUTH_API } from "../auth.config";

export const authApi = {
  register: async (data: {
    ci: number;
    name: string;
    contrasena: string;
    roles?: number[];
  }) => {
    const res = await fetch(`${AUTH_API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error al registrar usuario");
    }

    return res.json();
  },

  login: async (data: { ci: number; contrasena: string }) => {
    const res = await fetch(`${AUTH_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Error al iniciar sesión");
    }

    return res.json();
  },
};
