import { ApiProperty } from '@nestjs/swagger';

import type { ImageEntity } from '../../../product/image.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';

export class ImageDto extends AbstractDto {
  @ApiProperty()
  name: string;

  constructor(image: ImageEntity) {
    super(image);

    this.name = image.name;
  }
}
