import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaymentMethodEnum } from '../../../constants/payment-method.enum';
import { CreateAddressDto } from '../../user/dtoes/create-address.dto';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverFullName: string;

  @ApiProperty({
    type: CreateAddressDto,
  })
  @IsNotEmpty()
  addressCredetentials: CreateAddressDto;

  @ApiProperty({
    type: OrderItemDto,
    isArray: true,
  })
  @IsArray()
  ordersArray: OrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  extraInformation: string;

  @ApiProperty({ default: false })
  @IsNotEmpty()
  saveAddress: boolean;

  @ApiProperty()
  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;
}
