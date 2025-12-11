export class UserResponseDto {
  ci: number;
  name: string;
  fechaNacimiento: Date | null;
  activacion: boolean;
  roles?: any[];
  telefonos?: any[];
  emails?: any[];
  propiedades?: any[];

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}