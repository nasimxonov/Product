import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { products: true },
    });

    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }

    return null;
  }
}
