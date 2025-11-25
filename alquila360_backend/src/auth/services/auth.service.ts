import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // ----------------------------------------------------
    // 1. PROPIEDAD PARA LA LISTA NEGRA DE TOKENS
    // Set es eficiente para añadir y verificar la existencia de tokens.
    private blacklistedTokens: Set<string> = new Set(); 
    // ----------------------------------------------------

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
            // Utilizamos UnauthorizedException en lugar de Error
            throw new UnauthorizedException('Credenciales inválidas'); 
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new UnauthorizedException('Credenciales inválidas');
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

    
    addToBlacklist(token: string): void {
        this.blacklistedTokens.add(token);
        console.log(`[LOGOUT] Token añadido a la lista negra. Total de tokens revocados: ${this.blacklistedTokens.size}`);
    }

    isTokenBlacklisted(token: string): boolean {
        return this.blacklistedTokens.has(token);
    }
    logout() {
        return { message: 'Logout exitoso (manejo de revocación en el middleware)' };
    }
}
