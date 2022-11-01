import { ApiProperty } from '@nestjs/swagger';

import type { UserFavoriteEntity } from '../../../product/user-favorite.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import { ProductDto } from './product.dto';

export class UserFavoriteDto extends AbstractDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  product: ProductDto;

  constructor(userFavorite: UserFavoriteEntity) {
    super(userFavorite);

    this.userId = userFavorite.userId;
    this.productId = userFavorite.productId;
    this.product = userFavorite.product?.toDto();
  }
}
