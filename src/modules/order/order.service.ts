import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import type { OrderDto } from '../common/modules/order/order.dto';
import type { UserDto } from '../common/modules/user/user.dto';
import { PaymentService } from '../payment/payment.service';
import { ProductRepository } from '../product/product.repository';
import type { CreateOrderDto } from './dtoes/create-order.dto';
import type { UpdateOrderStatusDto } from './dtoes/update-order-status.dto';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly paymentService: PaymentService,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createCart(orderDto: CreateOrderDto, user: UserDto) {
    const productsArray = [];
    const total = await orderDto.ordersArray
      .reduce(async (sum, item) => {
        const product = await this.productRepository.findByCode(item.code);
        product.quantity = item.quantity;
        productsArray.push(product);

        return (await sum) + product.price * item.quantity;
      }, 0 as unknown as Promise<number>)
      .catch(() => {
        throw new HttpException('Invalid products', HttpStatus.BAD_REQUEST);
      });

    return this.paymentService.createOrder(
      total,
      productsArray,
      user,
      orderDto,
    );
  }

  async findAll(): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findAll();

    return orders.map((order) => order.toDto());
  }

  async getSummary(): Promise<Record<string, number>> {
    const orders = await this.orderRepository.findAll();
    const total: number = orders.reduce((sum, item) => sum + item.summary, 0);

    return { total, count: orders.length };
  }

  async findAllUserOrders(userId: string): Promise<OrderDto[]> {
    const orders = await this.orderRepository.findByUserId(userId);

    return orders.map((order) => order.toDto());
  }

  async findOneById(orderId: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(orderId);

    return order.toDto();
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    await this.orderRepository.update(orderId, {
      status: updateOrderStatusDto.orderStatus,
    });

    return (await this.orderRepository.findById(orderId)).toDto();
  }

  async findOneOrder(userId: string, orderId: string): Promise<OrderDto> {
    const order = await this.orderRepository.findOneByIds(orderId, userId);

    return order.toDto();
  }
}
