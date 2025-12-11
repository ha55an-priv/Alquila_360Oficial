import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('sort') sort?: string, @Query('order') order?: 'ASC' | 'DESC') {
    return this.usersService.findAll(page, limit, sort, order);
  }

  @Get('role/tecnicos') async getTechnicians() { return this.usersService.getTechnicians(); }
  @Get('role/inquilinos') async getTenants() { return this.usersService.getTenants(); }
  @Get('role/propietarios') async getOwners() { return this.usersService.getOwners(); }

  @Get('stats/count') async countUsers() {
    const count = await this.usersService.countUsers();
    return { total: count };
  }

  @Get(':ci') async findOne(@Param('ci', ParseIntPipe) ci: number) { return this.usersService.findOne(ci); }
  @Post() async create(@Body() createUserDto: CreateUserDto) { return this.usersService.create(createUserDto); }
  @Put(':ci') async update(@Param('ci', ParseIntPipe) ci: number, @Body() updateUserDto: UpdateUserDto) { return this.usersService.update(ci, updateUserDto); }
  @Delete(':ci') async remove(@Param('ci', ParseIntPipe) ci: number) { return this.usersService.remove(ci); }
}
