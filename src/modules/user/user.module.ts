import { Module } from '@nestjs/common';

import { TypeOrmExModule } from '../../db/typeorm-ex.module';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';
import { ContactRepository } from './contact.repostitory';
import { ContactService } from './contact.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      AddressRepository,
      ContactRepository,
    ]),
  ],
  controllers: [UserController],
  exports: [UserService, AddressService, ContactService],
  providers: [UserService, AddressService, ContactService],
})
export class UserModule {}
