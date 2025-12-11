// src/auth/register.dto.ts (ejemplo basado en tu código)
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsNumber()
    ci: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    contrasena: string; // Contraseña en texto plano

    @IsOptional()
    @IsDateString()
    fechaNacimiento?: Date | null;

    @IsOptional()
    @IsArray()
    roles?: number[]; // IDs de roles
}