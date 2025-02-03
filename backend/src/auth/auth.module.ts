import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt.strategy';
import { PrismaModule } from 'prisma/primas.modules'; 
//import { PrismaService } from '../../prisma/prisma.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // Coloque um segredo no .env
      signOptions: { expiresIn: '1h' }, // Token expira em 1 hora
    }),
    PrismaModule, // Para interagir com o banco
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
