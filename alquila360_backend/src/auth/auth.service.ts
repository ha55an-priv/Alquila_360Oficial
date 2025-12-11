// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { RegisterUserDto } from 'src/user/dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.contrasena, salt);

    const user = this.userRepo.create({ ...dto, contrasena: hashedPassword });
    return this.userRepo.save(user);
  }

  async validateUser(ci: number, password: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { ci }, relations: ['roles'] });
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.contrasena);
    if (!passwordValid) return null;

    return user;
  }
}