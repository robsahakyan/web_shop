import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { UserFavoriteDto } from '../common/modules/product/user-favorite.dto';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'favorites' })
export class UserFavoriteEntity extends AbstractEntity<UserFavoriteDto> {
  @Column()
  @Index()
  userId: string;

  @Column()
  @Index()
  productId: string;

  @ManyToOne(() => ProductEntity, (product) => product.userFavorites)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.favoriteProducts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  dtoClass = UserFavoriteDto;
}
