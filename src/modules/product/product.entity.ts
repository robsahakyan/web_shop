import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { ShowEnum } from '../../constants/show.enum';
import { CategoryEntity } from '../category/category.entity';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { ProductDto } from '../common/modules/product/product.dto';
import { EventEntity } from '../event/event.entity';
import { TargetEntity } from '../target/target.entity';
import { ImageEntity } from './image.entity';
import { UserFavoriteEntity } from './user-favorite.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity<ProductDto> {
  @Column()
  name: string;

  @Column({ nullable: true })
  name_ru: string;

  @Column({ nullable: true })
  name_en: string;

  @Column({ unique: true })
  code: number;

  @OneToMany(() => ImageEntity, (image) => image.product, { nullable: true })
  image: ImageEntity[];

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  description_ru: string;

  @Column({ nullable: true })
  description_en: string;

  @Column()
  price: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => EventEntity, (event) => event.products, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @ManyToOne(() => TargetEntity, (target) => target.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'target_id' })
  target: TargetEntity;

  @Column({ nullable: true })
  fromAge: number;

  @Column({ nullable: true })
  toAge: number;

  @Column({ default: 0 })
  views_count: number;

  @Column({ type: 'enum', enum: ShowEnum, default: ShowEnum.FALSE })
  show: ShowEnum;

  @Column()
  stock: number;

  @OneToMany(() => UserFavoriteEntity, (userFavorite) => userFavorite.product)
  userFavorites: UserFavoriteEntity[];

  dtoClass = ProductDto;

  quantity: number;
}
