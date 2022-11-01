import { Injectable } from '@nestjs/common';

import { AddressStatusEnum } from '../../constants/address-status.enum';
import type { AddressDto } from '../common/modules/user/address.dto';
import type { UserDto } from '../common/modules/user/user.dto';
import { AddressRepository } from './address.repository';
import type { CreateAddressDto } from './dtoes/create-address.dto';
import type { UpdateAddressDto } from './dtoes/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    user: UserDto,
  ): Promise<AddressDto> {
    const address = this.addressRepository.create({
      user,
      address: createAddressDto.address,
      name: `${user.fullName}`,
      city: createAddressDto.city,
      phoneNumber: createAddressDto.phoneNumber,
      apartment: createAddressDto.apartment,
      entrance: createAddressDto.entrance,
      floor: createAddressDto.floor,
      intercom: createAddressDto.intercom,
    });

    return (await this.addressRepository.save(address)).toDto();
  }

  async getAllAddress(userId: string): Promise<AddressDto[]> {
    const addresses = await this.addressRepository.findAllAddresses(
      userId,
      AddressStatusEnum.USER_OWN_ADDRESS,
    );

    return addresses.map((address) => address.toDto());
  }

  async getSingleAddress(userId: string, id: string): Promise<AddressDto> {
    const address = await this.addressRepository.findOneAddress(userId, id);

    return address.toDto();
  }

  async updateAddress(id: string, updateAddressDto: UpdateAddressDto) {
    return this.addressRepository.update(id, updateAddressDto);
  }

  async deleteAddress(id: string): Promise<void> {
    await this.addressRepository.delete(id);
  }
}
