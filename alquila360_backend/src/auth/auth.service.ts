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
import { RegisterDto } from './register.dto';
import { Role } from 'src/entity/rol.entity';
import { In } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role) // <-- Inyectar repositorio de Role
    private roleRepo: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    // 1. HASH LA CONTRASEÑA ANTES DE GUARDAR
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.contrasena, salt);

    // 2. BUSCAR ROLES
    let roles: Role[] = [];
    if (Array.isArray(dto.roles) && dto.roles.length > 0) {
      roles = await this.roleRepo.find({
        where: { idRol: In(dto.roles) },
      });
    }

    // 3. CREAR Y GUARDAR USUARIO CON HASH
    const user = this.userRepo.create({
      ...dto,
      contrasena: hashedPassword, // <-- Guardar el hash, no el texto plano
      activacion: true,
      roles,
    });

    return this.userRepo.save(user);
  }

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
