import type { AddressStatusEnum } from "constants/address-status.enum";
import { Repository } from "typeorm";

import { CustomRepository } from "../../db/typeorm-ex.decorator";
import { AddressEntity } from "./user-address.entity";

@CustomRepository(AddressEntity)
export class AddressRepository extends Repository<AddressEntity> {
  async findById(id: string): Promise<AddressEntity | null> {
    const address = this.createQueryBuilder("address")
      .where("address.id = :addressId", { addressId: id })
      .getOne();

    return address;
  }

  async findAllAddresses(
    userId: string,
    status: AddressStatusEnum
  ): Promise<AddressEntity[] | null> {
    const addresses = this.createQueryBuilder("address")
      .where("address.userId = :userId", { userId })
      .andWhere("address.status = :status", { status })
      .getMany();

    return addresses;
  }

  async findOneAddress(
    userId: string,
    addressId: string
  ): Promise<AddressEntity | null> {
    const address = this.createQueryBuilder("address")
      .where("address.id = :addressId", { addressId })
      .andWhere("address.userId = :userId", { userId })
      .getOne();

    return address;
  }
}
