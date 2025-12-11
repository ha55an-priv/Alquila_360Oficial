import { instance } from "../utils/axios.util"

// Asegúrate de que esta interfaz exista o defínela si es necesario
// Ejemplo: type User = { ci: number; nombre: string; email: string; ... }
interface User {
    ci: number;
    // Agrega aquí todas las propiedades de tu entidad User
}


export const getUsers = async () => {
    // 💡 Ruta corregida: /users (plural)
    const response = await instance.get("/users");
    return response.data;
}


export const createUser = async (user: Partial<User>) => {
    // 💡 Ruta corregida: /users (plural)
    const response = await instance.post("/users", user);
    return response.data;
}


export const getUserById = async (ci: number) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.get(`/users/${ci}`);
    return response.data;
}


export const updateUser = async (ci: number, userData: Partial<User>) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.put(`/users/${ci}`, userData);
    return response.data;
}


export const deleteUser = async (ci: number) => {
    // 💡 Ruta y parámetro corregidos: /users/${ci}
    const response = await instance.delete(`/users/${ci}`);
    return response.data;
}

// Nota Adicional: Si necesitas las funciones de roles, se agregarían aquí
/*
// Llama a: GET http://localhost:3001/users/role/tecnicos
export const getTechnicians = async () => {
    const response = await instance.get("/users/role/tecnicos");
    return response.data;
}
*/