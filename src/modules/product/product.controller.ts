import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: any) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    return this.productService.findOne(numericId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: any) {
    const numericId = Number(id);
    return this.productService.update(numericId, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const numericId = Number(id);
    return this.productService.remove(numericId);
  }
}
