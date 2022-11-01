import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { OrderEnum } from '../../../constants/order.enum';

export class PageOptionsDto {
  @IsEnum(OrderEnum)
  @IsOptional()
  @ApiPropertyOptional()
  readonly order: OrderEnum = OrderEnum.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiPropertyOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(1000)
  @IsOptional()
  @ApiPropertyOptional()
  readonly take: number = 12;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @IsString()
  @IsOptional()
  readonly q?: string;
}
