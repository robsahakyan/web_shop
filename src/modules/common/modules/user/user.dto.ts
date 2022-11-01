import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GenderEnum } from '../../../../constants/gender.enum';
import { RoleEnum } from '../../../../constants/role.enum';
import { UserStatusEnum } from '../../../../constants/user-status.enum';
import type { UserEntity } from '../../../user/user.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';
import type { UserFavoriteDto } from '../product/user-favorite.dto';
import type { AddressDto } from './address.dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  role: RoleEnum;

  @ApiPropertyOptional()
  birthday?: Date;

  @ApiPropertyOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  addresses?: AddressDto[];

  @ApiPropertyOptional()
  favoriteProducts?: UserFavoriteDto[];

  @ApiProperty()
  status: UserStatusEnum;

  constructor(user: UserEntity) {
    super(user);
    this.fullName = user.fullName;
    this.email = user.email;
    this.phone = user.phone;
    this.role = user.role;
    this.birthday = user.birthday;
    this.gender = user.gender;
    this.image = user.image;
    this.status = user.status;
    this.addresses = user.addresses?.map((address) => address.toDto());
    this.favoriteProducts = user.favoriteProducts?.map((favoriteProduct) =>
      favoriteProduct.toDto(),
    );
  }
}
