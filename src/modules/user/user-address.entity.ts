import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import { AddressStatusEnum } from '../../constants/address-status.enum';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { AddressDto } from '../common/modules/user/address.dto';
import { OrderEntity } from '../order/order.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'address' })
export class AddressEntity extends AbstractEntity<AddressDto> {
  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  apartment: number;

  @Column({ nullable: true })
  entrance: number;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  intercom: number;

  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => UserEntity, (userEntity: UserEntity) => userEntity.addresses)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(
    () => OrderEntity,
    (orderEntity: OrderEntity) => orderEntity.address,
  )
  order?: OrderEntity[];

  @Column({
    type: 'enum',
    enum: AddressStatusEnum,
    default: AddressStatusEnum.USER_OWN_ADDRESS,
  })
  status: AddressStatusEnum;

  dtoClass = AddressDto;
}
