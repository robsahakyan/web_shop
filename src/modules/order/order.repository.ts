import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { OrderEntity } from './order.entity';

@CustomRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async findAll(): Promise<OrderEntity[] | null> {
    const orders = this.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .getMany();

    return orders;
  }

  async findByUserId(userId: string): Promise<OrderEntity[] | null> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.products', 'orderProduct')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .where('order.userId = :userId', { userId })
      .getMany();
  }

  async findOneByIds(
    orderId: string,
    userId: string,
  ): Promise<OrderEntity | null> {
    return this.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.products', 'orderProduct')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.userId = :userId', { userId })
      .getOne();
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const user = this.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.products', 'orderProduct')
      .leftJoinAndSelect('order.address', 'address')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .where('order.id = :orderId', { orderId: id })
      .getOne();

    return user;
  }

  async findOneByPaymentId(paymentId: string): Promise<OrderEntity | null> {
    const order = this.createQueryBuilder('order')
      .where('order.paymentId = :paymentId', { paymentId })
      .getOne();

    return order;
  }
}
