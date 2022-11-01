import { Column, Entity, OneToMany } from 'typeorm';

import { GenderEnum } from '../../constants/gender.enum';
import { RoleEnum } from '../../constants/role.enum';
import { UserStatusEnum } from '../../constants/user-status.enum';
import { AbstractEntity } from '../common/entities/abstract.entity';
import { UserDto } from '../common/modules/user/user.dto';
import { UserFavoriteEntity } from '../product/user-favorite.entity';
import { AddressEntity } from './user-address.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RoleEnum })
  role: RoleEnum;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @Column({ nullable: true })
  image: string;

  @OneToMany(
    () => AddressEntity,
    (addressEntity: AddressEntity) => addressEntity.user,
  )
  addresses?: AddressEntity[];

  @OneToMany(
    () => UserFavoriteEntity,
    (userFavoriteEntity: UserFavoriteEntity) => userFavoriteEntity.user,
  )
  favoriteProducts?: UserFavoriteEntity[];

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.ACTIVE,
  })
  status: UserStatusEnum;

  dtoClass = UserDto;
}
