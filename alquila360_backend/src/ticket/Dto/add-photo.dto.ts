import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class AddPhotoDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  publicId?: string;
}

export class AddMultiplePhotosDto {
  @IsArray()
  @IsNotEmpty()
  fotos: AddPhotoDto[];
}
