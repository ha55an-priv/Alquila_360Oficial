import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HController } from './h/h.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TecnicosModule } from './tecnicos/tecnicos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Alquila360@2025', // ← PON TU PASSWORD REAL
      database: 'alquila360',      // ← PON EL NOMBRE REAL DE TU BASE
      autoLoadEntities: true,
      synchronize: true,        // ← TRUE solo para desarrollo
    }),

    UserModule,
    AuthModule,
    TecnicosModule,
  ],
  controllers: [AppController, HController],
  providers: [AppService],
})
export class AppModule {}

