// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { ci: Number(dto.ci) },
      relations: ['roles'],
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const passOk = await bcrypt.compare(dto.contrasena, user.contrasena);

    if (!passOk) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = {
      ci: user.ci,
      roles: user.roles.map((r) => r.nombre),
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token,
      user,
    };
  }
}
