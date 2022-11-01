import { Repository } from 'typeorm';

import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { ContactEntity } from './contact.entity';

@CustomRepository(ContactEntity)
export class ContactRepository extends Repository<ContactEntity> {
  async findById(id: string): Promise<ContactEntity | null> {
    const contact = this.createQueryBuilder('contact')
      .where('contact.id = :contactId', { contactId: id })
      .getOne();

    return contact;
  }

  async findAll(): Promise<ContactEntity[] | null> {
    const contact = this.createQueryBuilder('contact').getMany();

    return contact;
  }

  async findOneAddress(
    userId: string,
    addressId: string,
  ): Promise<ContactEntity | null> {
    const contact = this.createQueryBuilder('address')
      .where('address.addressId = :addressId', { addressId })
      .andWhere('address.userId = :userId', { userId })
      .getOne();

    return contact;
  }
}
