import { instance } from "../utils/axios.util"


interface User {
    ci: number;
    // Agrega aquí todas las propiedades de tu entidad User
}


export const getUsers = async () => {
 
    const response = await instance.get("/user");
    return response.data;
}


export const createUser = async (user: Partial<User>) => {

    const response = await instance.post("/user", user);
    return response.data;
}


export const getUserById = async (ci: number) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.get(`/user/${ci}`);
    return response.data;
}


export const updateUser = async (ci: number, userData: Partial<User>) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.put(`/user/${ci}`, userData);
    return response.data;
}


export const deleteUser = async (ci: number) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.delete(`/user/${ci}`);
    return response.data;
}

