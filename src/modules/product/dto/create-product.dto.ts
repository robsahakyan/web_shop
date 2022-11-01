import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_ru: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en: string;

  @ApiProperty()
  @IsNumberString()
  code: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description_ru: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description_en: string;

  @ApiProperty()
  @IsNumberString()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  event: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  target: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  fromAge: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  toAge: number;

  @ApiProperty()
  @IsNumberString()
  stock: number;
}
