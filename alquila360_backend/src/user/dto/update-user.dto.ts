import { IsEmail, IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsBoolean, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;

  @IsOptional()
  @IsBoolean()
  activacion?: boolean;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  telefonos?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  rolesId?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  propiedadIds?: number[];

  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;
}
