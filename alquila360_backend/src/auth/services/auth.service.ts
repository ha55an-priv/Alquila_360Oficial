import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

@Injectable()
export class AuthService {

  // Definimos el tipo de usuario directamente aquí
  private users: {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'user';
  }[] = [];

  async register(username: string, password: string, role: 'admin' | 'user') {
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
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    };
  }

  async login(username: string, password: string) {
    const user = this.users.find(u => u.username === username);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Contraseña incorrecta');
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      message: 'Login exitoso',
      token,
    };
  }

  logout() {
    return { message: 'Logout exitoso (token inválido del lado del cliente)' };
  }
}
