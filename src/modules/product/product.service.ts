import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Prisma } from '@prisma/client'; // `Prisma.ProductCreateInput` uchun

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Mahsulot topilmadi: ID = ${id}`);
    }

    return product;
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`siz bergan id topilmadi`);
    }

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`O'chirish uchun id topilmadi`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
