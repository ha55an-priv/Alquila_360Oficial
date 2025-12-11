import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ){}

  async validateUser(email: string, password: string){
    const user = await this.userService.findByEmail(email);
    if(!user) throw new UnauthorizedException('Usuario no encontrado');
    

    const valid = await bcrypt.compare(password, user.passwordHash);
    if(!valid) throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  async login(user: any){
    const payload = { sub: user.id, email: user.email, role: user.role};

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}