import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "src/entity/user.entity";

@Controller('/user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Post()
    create(@Body() body: any) {
    return this.userService.create(body);
    }
    @Get()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('/:id')
    getUserByID(@Param() param: any) {
        return this.userService.getUserById(param.id);
    }

    @Put('/:id')
    updateUser(@Param() param: any, @Body() user: User) {
        return this.userService.updateUser(param.id, user);
    }

    @Delete('/:id')
    deleteUser(@Param() param: any) {
        return this.userService.deleteUser(param.id);
    }
}