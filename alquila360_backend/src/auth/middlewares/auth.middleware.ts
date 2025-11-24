import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from '../config/auth.config';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    if (this.authService.isTokenBlacklisted(token)) {
      return res.status(401).json({ error: 'Token inválido (logout)' });
    }

    try {
      const decoded = jwt.verify(token, jwtConstants.secret);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token no válido' });
    }
  }
}
