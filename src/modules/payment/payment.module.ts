import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { OrderRepository } from '../order/order.repository';
import { OrderProductRepository } from '../order/order-product.repository';
import { AddressRepository } from '../user/address.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      OrderRepository,
      OrderProductRepository,
      AddressRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
