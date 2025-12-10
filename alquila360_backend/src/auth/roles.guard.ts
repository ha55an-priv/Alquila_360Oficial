// src/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', ctx.getHandler()) || [];

    // Si no se especificaron roles, se permite el acceso
    if (!requiredRoles.length) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles) return false;

    const userRoles = user.roles
      .map((r: any) => r.nombre)
      .filter(Boolean)
      .map((name: string) => name.toLowerCase());

    const requiredLower = requiredRoles.map((r) => r.toLowerCase());

    return requiredLower.some((role) => userRoles.includes(role));
  }
}
