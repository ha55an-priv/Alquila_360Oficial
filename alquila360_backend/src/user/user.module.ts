import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';

import { User } from '../entity/user.entity';
import { Role } from '../entity/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),  
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule], // opcional, pero útil si otros módulos necesitan User/Role
})
export class UserModule {}
