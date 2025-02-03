import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
//import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}


  async validateUser(username: string, password: string): Promise<any> {
   
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
        access_token: this.jwtService.sign(payload, {
          expiresIn: '30m',  
        }),
    };
  }

  async register(data: { email: string; username: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: { 
        email: data.email, 
        username: data.username, 
        password: hashedPassword 
      },
    });
  }
}
