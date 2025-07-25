import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existing) {
      throw new BadRequestException('Bu username band');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          fullname: dto.fullname,
          phone_number: dto.phone_number,
          username: dto.username,
          password: hashedPassword,
        },
        select: {
          id: true,
          fullname: true,
          phone_number: true,
          username: true,
        },
      });

      const token = this.jwtService.sign({
        sub: user.id,
        username: user.username,
      });

      return {
        message: 'Muvaffaqiyatli royxatdan otildi',
        user,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException('Serverda xatolik yuz berdi');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new BadRequestException('Bunday foydalanuvchi topilmadi');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Parol notogri');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return {
      message: 'Tizimga muvaffaqiyatli kirildi',
      user: {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        phone_number: user.phone_number,
      },
      token,
    };
  }
}
