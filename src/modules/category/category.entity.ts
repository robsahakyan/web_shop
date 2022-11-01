import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { CategoryDto } from '../common/modules/category/category.dto';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity<CategoryDto> {
  @Column({ unique: true })
  name: string;

  @Column()
  products_count: number;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

  dtoClass = CategoryDto;
}
