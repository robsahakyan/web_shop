import { ApiProperty } from '@nestjs/swagger';

import type { EventEntity } from '../../../event/event.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import type { ProductDto } from '../product/product.dto';

export class EventDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  products?: ProductDto[];

  constructor(event: EventEntity) {
    super(event);

    this.name = event.name;
    this.products = event.products?.map((product) => product.toDto());
  }
}
