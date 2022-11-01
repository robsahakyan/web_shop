import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductRepository } from '../product/product.repository';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
import { OrderProductRepository } from './order-product.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      OrderRepository,
      OrderProductRepository,
      ProductRepository,
    ]),
    forwardRef(() => PaymentModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
