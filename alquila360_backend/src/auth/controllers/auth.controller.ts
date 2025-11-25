import { Controller, Post, Body, Get, Req, Headers, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro de usuario
  @Post('register')
  async register(@Body() data: { username: string; password: string; role: 'admin' | 'user' }) {
    return this.authService.register(data.username, data.password, data.role);
  }

  // Login
  @Post('login')
  async login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data.username, data.password);
  }

  // ----------------------------------------------------
  // LOGOUT CORREGIDO: Revocación de Token (Blacklisting)
  // ----------------------------------------------------
  @Post('logout')
  @HttpCode(200) // Devuelve 200 OK en caso de éxito
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException('Token de autorización no proporcionado.');
    }
    
    // El formato esperado es 'Bearer [TOKEN]'
    if (authHeader.startsWith('Bearer ')) {
      // Extrae solo el token (quitando "Bearer ")
      const token = authHeader.substring(7); 
      
      // Llama al servicio para añadir el token a la lista negra
      this.authService.addToBlacklist(token);
      
      return { message: 'Sesión cerrada y token revocado correctamente.' };
    }

    throw new UnauthorizedException('Formato de token inválido. Use el formato "Bearer <token>".');
  }

  // Obtener perfil (ejemplo simple)
  @Get('profile')
  profile(@Req() req: any) {
    return { user: req.user || null };
  }
}


