// src/auth/login.dto.ts
import { IsNumberString, IsString } from 'class-validator';

export class LoginDto {
  @IsNumberString()
  ci: string;

  @IsString()
  contrasena: string;
}
