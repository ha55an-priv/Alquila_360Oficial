import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FilterAlertDto } from './dto/filter-alert.dto';

@Controller('alertas')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Post()
  async create(@Body() createDto: CreateAlertDto) {
    return this.alertService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query() filterDto?: FilterAlertDto
  ) {
    return this.alertService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      sort || 'fechaCreacion',
      order,
      filterDto
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alertService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateAlertDto) {
    return this.alertService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.alertService.remove(id);
  }

  @Get('stats/overall')
  async getStats() {
    return this.alertService.getStats();
  }
}