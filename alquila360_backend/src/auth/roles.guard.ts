// src/auth/roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos de la metadata
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()) || [];

    // Si no se requiere ningún rol, permitir acceso
    if (!requiredRoles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Validar que exista usuario y roles
    if (!user || !user.roles) return false;

    // Normalizar nombres de roles a minúsculas
    const userRoles = user.roles
      .map((r: any) => r.nombre)
      .filter(Boolean)
      .map((r: string) => r.toLowerCase());

    const requiredLower = requiredRoles.map((r) => r.toLowerCase());

    // Verificar si el usuario tiene al menos un rol requerido
    return requiredLower.some((role) => userRoles.includes(role));
  }
}
