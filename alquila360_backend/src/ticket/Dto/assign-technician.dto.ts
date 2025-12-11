import { IsInt } from 'class-validator';

export class AssignTechnicianDto {
  @IsInt()
  idTecnico: number;
}
