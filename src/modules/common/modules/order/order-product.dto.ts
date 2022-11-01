import { ApiProperty } from "@nestjs/swagger";

import type { OrderProductEntity } from "../../../order/order-product.entity";
import { AbstractDto } from "../../dtoes/abstract.dto";
import { ProductDto } from "../product/product.dto";
import { OrderDto } from "./order.dto";

export class OrderProductDto extends AbstractDto {
  @ApiProperty()
  productName: string;

  @ApiProperty()
  productPrice: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  order: OrderDto;

  constructor(orderProduct: OrderProductEntity) {
    super(orderProduct);

    this.productName = orderProduct.productName;
    this.productPrice = orderProduct.productPrice;
    this.quantity = orderProduct.quantity;
    this.product = orderProduct.product?.toDto();
    this.order = orderProduct.order;
  }
}
