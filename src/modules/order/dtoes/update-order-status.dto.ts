import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { OrderStatusEnum } from '../../../constants/order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsEnum(OrderStatusEnum)
  orderStatus: OrderStatusEnum;
}
