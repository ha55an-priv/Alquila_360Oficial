import { instance } from "../utils/axios.util"

export const getUsers = async () => {
    const reponse = await instance.get("/user");
    return reponse.data;
}

export const createUser = async (user: Partial<User>) => {
    const response = await instance.post("/user", user);
    return response.data;
}

export const getUserById = async (id: number) => {
    const response = await instance.get(`/user/${id}`);
    return response.data;
}

export const updateUser = async (id: number, userData: Partial<User>) => {
    const response = await instance.put(`/user/${id}`, userData);
    return response.data;
}

export const deleteUser = async (id: number) => {
    const response = await instance.delete(`/user/${id}`);
    return response.data;
}
