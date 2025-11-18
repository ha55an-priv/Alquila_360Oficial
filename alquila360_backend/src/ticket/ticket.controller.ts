import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateTicketDto, UpdateTicketDto } from "./ticket.dto";
import { Ticket } from "../entity/ticket.entity";

@Controller("tickets")
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() body: CreateTicketDto): Promise<Ticket> {
    return this.ticketService.create(body);
  }

  @Get()
  async findAll(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Ticket> {
    return this.ticketService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateTicketDto
  ): Promise<Ticket> {
    return this.ticketService.update(id, body);
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.ticketService.remove(id);
  }
}
