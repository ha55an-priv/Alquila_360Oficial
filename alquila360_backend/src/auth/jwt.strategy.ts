// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ALQUILA360_SUPER_SECRET', // cámbialo en prod
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { ci: payload.ci },
      relations: ['roles'],
    });

    if (!user) throw new UnauthorizedException();

    return user; // se inyecta en req.user
  }
}
