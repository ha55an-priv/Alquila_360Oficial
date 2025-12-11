import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsInt()
  ci: number;

  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
