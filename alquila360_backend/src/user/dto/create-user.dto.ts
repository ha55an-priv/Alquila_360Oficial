export class CreateUserDto {
  ci: number;
  name: string;
  contrasena: string;
  fechaNacimiento?: string; // "2000-10-10"
  roles?: number[];         // IDs de rol, ej: [1, 2]
}