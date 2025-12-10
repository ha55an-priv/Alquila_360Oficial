import { instance } from "../utils/axios.util";
import { isAxiosError } from "axios";

interface loginData {
  email: string;
  password: string;
}

interface loginResponse {
  token: string;
  userId: string;
  role: string;
  fullName: string;
  email: string;
}

const AuthService = {
  login: async (data: loginData): Promise<loginResponse> => {
    try {
      const response = await instance.post<loginResponse>("/auth/login", data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al iniciar sesión";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al iniciar sesión");
    }
  },
};

export default AuthService;
