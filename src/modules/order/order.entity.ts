import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { PaymentMethodEnum } from '../../constants/payment-method.enum';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { OrderDto } from '../common/modules/order/order.dto';
import { UserEntity } from '../user/user.entity';
import { AddressEntity } from '../user/user-address.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends AbstractEntity<OrderDto> {
  @Column()
  @Index()
  userId: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  summary: number;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => OrderProductEntity, (product) => product.order)
  products: OrderProductEntity[];

  @Column({ nullable: true })
  receiverFullName: string;

  @Column({ nullable: true })
  receiverPhoneNumber: string;

  @Column({ nullable: true })
  extraInformation: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.FOR_CACHE,
  })
  paymentMethod: PaymentMethodEnum;

  @OneToOne(
    () => AddressEntity,
    (addressEntity: AddressEntity) => addressEntity.id,
  )
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;

  dtoClass = OrderDto;
}
