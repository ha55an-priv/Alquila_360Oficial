// src/auth/dto/register-user.dto.ts
export class RegisterUserDto {
  ci: number;
  name: string;
  contrasena: string;
  fechaNacimiento?: Date | null;
}