import { ApiProperty } from '@nestjs/swagger';

import { PaymentMethodEnum } from '../../../../constants/payment-method.enum';
import type { OrderEntity } from '../../../order/order.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import { AddressDto } from '../user/address.dto';
import { UserDto } from '../user/user.dto';
import type { OrderProductDto } from './order-product.dto';

export class OrderDto extends AbstractDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  paymentId: string;

  @ApiProperty()
  address: AddressDto;

  @ApiProperty()
  summary: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty()
  products: OrderProductDto[];

  @ApiProperty()
  receiverFullName: string;

  @ApiProperty()
  receiverPhoneNumber: string;

  @ApiProperty()
  extraInformation: string;

  constructor(order: OrderEntity) {
    super(order);

    this.userId = order.userId;
    this.address = order.address?.toDto();
    this.summary = order.summary;
    this.paymentId = order.paymentId;
    this.status = order.status;
    this.receiverFullName = order.receiverFullName;
    this.receiverPhoneNumber = order.receiverPhoneNumber;
    this.extraInformation = order.extraInformation;
    this.user = order.user?.toDto();
    this.products = order.products?.map((product) => product.toDto());
    this.paymentMethod = order.paymentMethod;
  }
}
