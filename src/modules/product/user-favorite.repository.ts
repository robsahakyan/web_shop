import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { UserFavoriteEntity } from './user-favorite.entity';

@CustomRepository(UserFavoriteEntity)
export class UserFavoriteRepository extends Repository<UserFavoriteEntity> {
  async findByIdandUserId(
    userId: string,
    productId: string,
  ): Promise<UserFavoriteEntity | null> {
    const favorite = this.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.product', 'product')
      .where('favorite.user_id = :userId', { userId })
      .andWhere('favorite.product_id = :productId', { productId })
      .getOne();

    return favorite;
  }
}
