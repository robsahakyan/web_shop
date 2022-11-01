import { ApiProperty } from '@nestjs/swagger';

import type { TargetEntity } from '../../../target/target.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import type { ProductDto } from '../product/product.dto';

export class TargetDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  products?: ProductDto[];

  constructor(target: TargetEntity) {
    super(target);

    this.name = target.name;
    this.products = target.products?.map((product) => product.toDto());
  }
}
