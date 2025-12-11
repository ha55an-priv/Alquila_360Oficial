// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { RolesGuard } from './roles.guard';
import { Role } from '../entity/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: 'ALQUILA360_SUPER_SECRET', // TODO: .env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
