import { IsArray, IsInt, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class AssignTechnicianDto {
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  tecnicosIds: number[];

  @IsOptional()
  @MaxLength(300)
  notas?: string;
}
