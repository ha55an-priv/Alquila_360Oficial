// src/auth/register.dto.ts
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsInt()
  ci: number;

  @IsString()
  @IsNotEmpty()
  name: string;          // <-- ESTE CAMPO ES CLAVE

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsOptional()
  @IsArray()
  roles?: number[];
}
