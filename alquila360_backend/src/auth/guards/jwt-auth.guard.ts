// src/auth/guards/jwt-auth.guard.ts (Placeholder)
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Este guard es solo un placeholder, asumirá que la autenticación es exitosa
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Puedes anular el método canActivate si quieres añadir lógica de prueba
  canActivate(context: ExecutionContext) {
    // ⚠️ Temporalmente, forzamos que sea true para pasar la protección
    const isAuthSuccess = true; 
    
    // ⚠️ IMPORTANTE: Necesitas un objeto de usuario en req.user para que el controller no falle
    const request = context.switchToHttp().getRequest();
    request.user = { 
        userId: 1, // Usuario de prueba
        email: 'prueba@alquila360.com' 
    };
    
    return isAuthSuccess; 
  }
}