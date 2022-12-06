import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';

import { RoleEnum } from '../../constants/role.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import { ApiFile } from '../../decorators/swagger.decorator';
import { StorageProvider } from '../../providers/storage.provider';
import type { AddressDto } from '../common/modules/user/address.dto';
import { UserDto } from '../common/modules/user/user.dto';
import { AddressService } from './address.service';
import { ContactService } from './contact.service';
import { CreateAddressDto } from './dtoes/create-address.dto';
import { CreateContactDto } from './dtoes/create-contact.dto';
import { UpdateAddressDto } from './dtoes/update-address.dto';
import { UpdateUserPassword } from './dtoes/update-password.dto';
import { UpdateUserDto } from './dtoes/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    public readonly userService: UserService,
    public readonly addressService: AddressService,
    public readonly contactService: ContactService,
  ) {}

  @Auth(RoleEnum.ADMIN)
  @Get()
  async getAllUsers(): Promise<UserDto[]> {
    return this.userService.getAll();
  }

  @Auth(RoleEnum.ADMIN)
  @Get('getByemail/:email')
  async getByEmail(@Param('email') email: string): Promise<UserDto> {
    return this.userService.getByEmail(email);
  }

  @Auth(RoleEnum.ADMIN)
  @Get(':id')
  async getSingleUser(@UUIDParam('id') userId: string): Promise<UserDto> {
    return this.userService.getById(userId);
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Put(':id')
  @ApiFile([{ name: 'images' }], {
    okResponseData: {
      type: UpdateUserDto,
      description: 'image creation',
    },
  })
  @UseInterceptors(
    FileInterceptor('images', StorageProvider.avatarUploadFileOptions),
  )
  async updateUser(
    @AuthUser() user: UserDto,
    @UploadedFile() file,
    @UUIDParam('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    if (user.id === userId || user.role === RoleEnum.ADMIN) {
      return this.userService.update(userId, updateUserDto, file);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN)
  @Put('/block/:id')
  async blockUser(@UUIDParam('id') id: string) {
    return this.userService.block(id);
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Put('password/:id')
  async updatePassword(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: string,
    @Body() passwords: UpdateUserPassword,
  ): Promise<{ message: string }> {
    if (id === user.id || user.role === RoleEnum.ADMIN) {
      return this.userService.updatePassword(id, passwords);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Delete(':id')
  async deleteUser(
    @AuthUser() user: UserDto,
    @UUIDParam('id') id: string,
  ): Promise<void> {
    if (id === user.id || user.role === RoleEnum.ADMIN) {
      return this.userService.delete(id);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Post('address/:userId')
  async createAddress(
    @UUIDParam('userId') userId: string,
    @AuthUser() user: UserDto,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<AddressDto> {
    if (userId === user.id || user.role === RoleEnum.ADMIN) {
      return this.addressService.createAddress(createAddressDto, user);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Get('addresses/:userId')
  async getAllAddresses(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
  ): Promise<AddressDto[]> {
    if (userId === user.id || user.role === RoleEnum.ADMIN) {
      return this.addressService.getAllAddress(userId);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Get('addresses/:userId/:id')
  async getSingleAddress(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
    @UUIDParam('id') id: string,
  ): Promise<AddressDto> {
    if (user.id === userId || user.role === RoleEnum.ADMIN) {
      return this.addressService.getSingleAddress(userId, id);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Put('/address/:userId/:id')
  async updateAddress(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
    @UUIDParam('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    if (user.id === userId || user.role === RoleEnum.ADMIN) {
      return this.addressService.updateAddress(id, updateAddressDto);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Delete('/address/:userId/:id')
  async deleteAddress(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
    @UUIDParam('id') id: string,
  ) {
    if (user.id === userId || user.role === RoleEnum.ADMIN) {
      return this.addressService.deleteAddress(id);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Post('contact')
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Get('contact')
  async getAll() {
    return this.contactService.getAll();
  }

  @Auth(RoleEnum.ADMIN)
  @Get('contact/:id')
  async getOne(@UUIDParam('id') id: string) {
    return this.contactService.getOne(id);
  }
}
