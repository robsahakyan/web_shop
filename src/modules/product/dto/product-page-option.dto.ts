import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsUUID } from 'class-validator';

import { ProductsSortEnum } from '../../../constants/products-sort.enum';
import { PageOptionsDto } from '../../common/dtoes/page-options.dto';

export class ProductPageOptionDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  expectId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  eventId: string[];

  @ApiPropertyOptional()
  @IsOptional()
  targetId: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  fromAge: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  toAge: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProductsSortEnum)
  sortBy: ProductsSortEnum;
}
