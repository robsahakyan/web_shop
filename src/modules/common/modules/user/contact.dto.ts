import { ApiProperty } from '@nestjs/swagger';

import type { ContactEntity } from '../../../user/contact.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';

export class ContactDto extends AbstractDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  message: string;

  constructor(contact: ContactEntity) {
    super(contact);
    this.email = contact.email;
    this.description = contact.description;
    this.message = contact.message;
  }
}
