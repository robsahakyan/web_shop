import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { ProductEntity } from './product.entity';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async findByName(name: string): Promise<ProductEntity | null> {
    const product = this.createQueryBuilder('product')
      .where('product.name = :name', { name })
      .getOne();

    return product;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const product = this.createQueryBuilder('product')
      .where('product.id = :productId', { productId: id })
      .getOne();

    return product;
  }

  async findByCode(code: number): Promise<ProductEntity | null> {
    const product = this.createQueryBuilder('product')
      .where('product.code = :productCode', { productCode: code })
      .getOne();

    return product;
  }

  async getAndJoin(id: string): Promise<ProductEntity | null> {
    const product = this.createQueryBuilder('product')
      .leftJoinAndSelect('product.image', 'image')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.event', 'enevt')
      .leftJoinAndSelect('product.target', 'target')
      .where('product.id = :productId', { productId: id })
      .orWhere('image.product_id = :productId', { productId: id })
      .getOne();

    return product;
  }
}
