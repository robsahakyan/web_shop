import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { TargetDto } from '../common/modules/target/target.dto';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'targets' })
export class TargetEntity extends AbstractEntity<TargetDto> {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.target)
  products: ProductEntity[];

  dtoClass = TargetDto;
}
