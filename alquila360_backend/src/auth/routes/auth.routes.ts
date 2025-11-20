import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/login', 'auth/register')
      .forRoutes('*');
  }
}
