// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../entity/user.entity';
import { Role } from '../entity/rol.entity';

import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    private jwtService: JwtService,
  ) {}

  // =============== REGISTER ===============
  async register(dto: RegisterDto): Promise<any> {
    // 0. Verificar si ya existe un usuario con ese CI (si tu DTO tiene ci)
    if ((dto as any).ci) {
      const existing = await this.userRepo.findOne({
        where: { ci: Number((dto as any).ci) },
      });
      if (existing) {
        throw new ConflictException('Ya existe un usuario con ese CI');
      }
    }

    // 1. HASH DE LA CONTRASEÑA ANTES DE GUARDAR
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.contrasena, salt);

    // 2. BUSCAR ROLES SI LLEGAN EN EL DTO
    let roles: Role[] = [];
    if (Array.isArray(dto.roles) && dto.roles.length > 0) {
      roles = await this.roleRepo.find({
        where: { idRol: In(dto.roles) },
      });
    } else {
      // Opcional: asignar un rol por defecto, por nombre
      const defaultRole = await this.roleRepo.findOne({
        where: { nombre: 'Inquilino' }, // ajusta al nombre real en tu BD
      });
      if (defaultRole) {
        roles = [defaultRole];
      }
    }

    // 3. CREAR Y GUARDAR USUARIO CON HASH
    const user = this.userRepo.create({
      ...dto,
      contrasena: hashedPassword, // Guardar el hash, no el texto plano
      activacion: true,
      roles,
    });

    const saved = await this.userRepo.save(user);

    // 4. NO devolver la contraseña al frontend
    const { contrasena, ...safeUser } = saved as any;

    return {
      message: 'Usuario registrado correctamente',
      user: safeUser,
    };
  }

  // =============== LOGIN ===============
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { ci: Number(dto.ci) },
      relations: ['roles'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passOk = await bcrypt.compare(dto.contrasena, user.contrasena);

    if (!passOk) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const roles = user.roles?.map((r) => r.nombre) ?? [];

    const payload = {
      ci: user.ci,
      roles,
    };

    const token = this.jwtService.sign(payload);

    // También aquí ocultamos la contraseña en la respuesta
    const { contrasena, ...safeUser } = user as any;

    return {
      message: 'Login exitoso',
      token,          // mantiene el nombre que ya usabas
      user: safeUser, // user sin contraseña
    };
  }
}
