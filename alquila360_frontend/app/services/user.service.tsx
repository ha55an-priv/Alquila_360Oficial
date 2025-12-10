import { instance } from "../utils/axios.util";
import { isAxiosError } from "axios";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  contactPhone?: string;
}

interface RegisterResponse {
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

const RegisterService = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await instance.post<RegisterResponse>("/user", data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "Error al registrar el usuario";
        throw new Error(msg);
      }
      throw new Error("Error desconocido al registrar el usuario");
    }
  },
};

export default RegisterService;
