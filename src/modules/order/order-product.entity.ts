import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { OrderProductDto } from '../common/modules/order/order-product.dto';
import { ProductEntity } from '../product/product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'orderProduct' })
export class OrderProductEntity extends AbstractEntity<OrderProductDto> {
  @Column()
  @Index()
  productId: string;

  @Column()
  productName: string;

  @Column()
  productPrice: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.products)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  dtoClass = OrderProductDto;
}
