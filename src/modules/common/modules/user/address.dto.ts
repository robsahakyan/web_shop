import type { AddressStatusEnum } from '../../../../constants/address-status.enum';
import type { AddressEntity } from '../../../user/user-address.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';

export class AddressDto extends AbstractDto {
  address: string;

  name: string;

  city: string;

  phoneNumber: string;

  apartment?: number;

  entrance?: number;

  floor?: number;

  intercom?: number;

  status: AddressStatusEnum;

  constructor(address: AddressEntity) {
    super(address);
    this.address = address.address;
    this.name = address.name;
    this.city = address.city;
    this.phoneNumber = address.phoneNumber;
    this.apartment = address.apartment;
    this.entrance = address.entrance;
    this.floor = address.floor;
    this.intercom = address.intercom;
    this.status = address.status;
  }
}
