import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ShowEnum } from '../../../../constants/show.enum';
import type { ProductEntity } from '../../../product/product.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import { CategoryDto } from '../category/category.dto';
import { EventDto } from '../event/event.dto';
import type { ImageDto } from '../image/image.dto';
import { TargetDto } from '../target/target.dto';
import type { UserFavoriteDto } from './user-favorite.dto';

export class ProductDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  name_ru: string;

  @ApiProperty()
  name_en: string;

  @ApiProperty()
  code: number;

  @ApiProperty()
  image: ImageDto[];

  @ApiProperty()
  description: string;

  @ApiProperty()
  description_ru: string;

  @ApiProperty()
  description_en: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  category: CategoryDto;

  @ApiProperty()
  event: EventDto;

  @ApiProperty()
  target: TargetDto;

  @ApiProperty()
  fromAge: number;

  @ApiProperty()
  toAge: number;

  @ApiProperty()
  views_count: number;

  @ApiProperty()
  show: ShowEnum;

  @ApiProperty()
  stock: number;

  @ApiPropertyOptional()
  userFavorites: UserFavoriteDto[];

  constructor(product: ProductEntity) {
    super(product);

    this.name = product.name;
    this.name_ru = product.name_ru;
    this.name_en = product.name_en;
    this.code = product.code;
    this.image = product.image?.map((img) => img.toDto());
    this.description = product.description;
    this.description_ru = product.description_ru;
    this.description_en = product.description_en;
    this.price = product.price;
    this.category = product.category?.toDto();
    this.event = product.event?.toDto();
    this.target = product.target?.toDto();
    this.fromAge = product.fromAge;
    this.toAge = product.toAge;
    this.views_count = product.views_count;
    this.show = product.show;
    this.userFavorites = product.userFavorites?.map((userFavorite) =>
      userFavorite.toDto(),
    );
    this.stock = product.stock;
  }
}
