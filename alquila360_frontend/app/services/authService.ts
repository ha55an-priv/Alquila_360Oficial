import { User } from "../interfaces/User";
import { ApiResponse } from "../interfaces/ApiResponse";

const API_URL = "http://localhost:3001/auth";

export async function login(email: string, password: string): Promise<ApiResponse<User>> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function register(user: User): Promise<ApiResponse<User>> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.json();
}
