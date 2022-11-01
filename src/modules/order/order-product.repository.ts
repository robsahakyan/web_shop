import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { OrderProductEntity } from './order-product.entity';

@CustomRepository(OrderProductEntity)
export class OrderProductRepository extends Repository<OrderProductEntity> {}
