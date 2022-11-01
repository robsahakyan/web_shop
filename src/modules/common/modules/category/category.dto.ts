import { ApiProperty } from '@nestjs/swagger';

import type { CategoryEntity } from '../../../category/category.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import type { ProductDto } from '../product/product.dto';

export class CategoryDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  products_count: number;

  @ApiProperty()
  products?: ProductDto[];

  constructor(category: CategoryEntity) {
    super(category);

    this.name = category.name;
    this.products_count = category.products_count;
    this.products = category.products?.map((product) => product.toDto());
  }
}
