import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { generateToken } from '../utils/generateToken';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: any) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: any) {
    return this.authService.login(data);
  }

  @Post('logout')
  logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }

  @Get('profile')
  profile(@Req() req: any) {
    return { user: req.user };
  }
}
