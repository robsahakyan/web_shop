import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { ImageDto } from '../common/modules/image/image.dto';
import { ProductEntity } from './product.entity';

@Entity({ name: 'images' })
export class ImageEntity extends AbstractEntity<ImageDto> {
  @Column()
  name: string;

  @ManyToOne(() => ProductEntity, (product) => product.image)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  dtoClass = ImageDto;
}
