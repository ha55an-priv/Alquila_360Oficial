import { IsNotEmpty, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketStatus } from '../../entity/ticket.entity';

export class UpdateStatusDto {
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  estado: TicketStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comentarios?: string;
}
