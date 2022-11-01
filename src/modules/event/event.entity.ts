import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { EventDto } from '../common/modules/event/event.dto';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'events' })
export class EventEntity extends AbstractEntity<EventDto> {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.event)
  products: ProductEntity[];

  dtoClass = EventDto;
}
