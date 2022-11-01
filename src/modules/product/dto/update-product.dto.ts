import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

import { ShowEnum } from '../../../constants/show.enum';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description_ru?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description_en?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  event?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  target?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  fromAge?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  toAge?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  show?: ShowEnum;
}
