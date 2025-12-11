// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register') // <-- NUEVO ENDPOINT
  async register(@Body() dto: RegisterDto) {
   return this.authService.register(dto);
  }
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
