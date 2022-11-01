import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../common/entities/abstract.entity';
import { ContactDto } from '../common/modules/user/contact.dto';

@Entity({ name: 'contacts' })
export class ContactEntity extends AbstractEntity<ContactDto> {
  @Column()
  email: string;

  @Column()
  description: string;

  @Column({ type: 'text' })
  message: string;

  dtoClass = ContactDto;
}
