// src/role/role.controller.ts
import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findById(+id);
  }

  @Post()
  create(@Body('nombre') nombre: string) {
    console.log('Nombre recibido en controller:', nombre);
    return this.roleService.create(nombre);
  }
  

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.roleService.delete(+id);
  }
}