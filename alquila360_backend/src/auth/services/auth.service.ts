import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

@Injectable()
export class AuthService {

  private users: any[] = [];               // Usuarios en memoria
  private blacklistedTokens: string[] = []; // Lista negra de tokens

  
  async register(data: { username: string; password: string; role: 'admin' | 'user' }) {
  const { username, password, role } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
    role,
  };

  this.users.push(newUser);

  return {
    message: 'Usuario registrado correctamente',
    user: { id: newUser.id, username, role },
  };
}

async login(data: { username: string; password: string }) {
  const { username, password } = data;

  const user = this.users.find(u => u.username === username);

  if (!user) throw new Error('Usuario no encontrado');

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error('Contraseña incorrecta');

  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  return { message: 'Login exitoso', token };
}


  logout(token: string) {
    this.blacklistedTokens.push(token);
    return { message: 'Logout exitoso, token invalidado' };
  }

  // 👉 ESTE MÉTODO ES EL QUE FALTABA
  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.includes(token);
  }
}
