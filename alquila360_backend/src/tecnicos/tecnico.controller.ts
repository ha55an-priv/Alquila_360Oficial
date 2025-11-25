import { Controller, Post, Body, Get } from '@nestjs/common';
import { TecnicosService } from './tecnicos.service';

@Controller('tecnicos')
export class TecnicosController {
  constructor(private readonly tecnicosService: TecnicosService) {}

  @Post()
  create(@Body() body: any) {
    return this.tecnicosService.create(body);
  }

  @Get()
  findAll() {
    return this.tecnicosService.findAll();
  }
}

