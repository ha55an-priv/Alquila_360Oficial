import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { Role } from '../entity/rol.entity';
import { EmailUsuario } from '../entity/emailUsuario.entity';
import { TelefonoUsuario } from '../entity/telefonoUsuario.entity';
import { Propiedad } from '../entity/propiedad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, EmailUsuario, TelefonoUsuario, Propiedad])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}