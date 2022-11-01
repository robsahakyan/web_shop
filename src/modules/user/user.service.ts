import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import type { UpdateResult } from 'typeorm';

import { UserStatusEnum } from '../../constants/user-status.enum';
import { UtilsProvider } from '../../providers/utils.provider';
import type { UserDto } from '../common/modules/user/user.dto';
import type { CreateUserDto } from './dtoes/create-user.dto';
import type { UpdateUserPassword } from './dtoes/update-password.dto';
import type { UpdateUserDto } from './dtoes/update-user.dto';
import { BlockedUserFoundException } from './exception/blocked-user-found.exception';
import { UserCredientalException } from './exception/user-crediential.exception';
import { UserNotFoundException } from './exception/user-not-found.exception';
import type { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepository.findAllUser();

    return users.map((user) => user.toDto());
  }

  async getById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.toDto();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file,
  ): Promise<UpdateResult> {
    const user = await this.getById(id);

    if (user.image) {
      unlinkSync(user.image);
    }

    const image = file ? file.path : user.image;

    return this.userRepository
      .update(id, {
        ...updateUserDto,
        image,
      })
      .catch((error: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        unlinkSync(image);

        throw new UserCredientalException(error);
      });
  }

  async block(id: string) {
    const user = await this.getById(id);
    user.status =
      user.status === UserStatusEnum.ACTIVE
        ? UserStatusEnum.BLOCKED
        : UserStatusEnum.ACTIVE;

    return this.userRepository.update(id, user).catch((error: string) => {
      throw new UserCredientalException(error);
    });
  }

  async updatePassword(id: string, passwords: UpdateUserPassword) {
    const user = await this.userRepository.findById(id);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const validOldPassword = await UtilsProvider.validateHash(
      passwords.oldPassword,
      user.password,
    );

    if (!validOldPassword) {
      const description = 'incorrect old password';

      throw new UserCredientalException(description);
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      const description = 'incorrect confirm password';

      throw new UserCredientalException(description);
    }

    user.password = await UtilsProvider.generateHash(passwords.confirmPassword);

    await this.userRepository.save(user);

    return { message: 'successfully updated' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    createUserDto.password = await UtilsProvider.generateHash(
      createUserDto.password,
    );

    const userEntity = this.userRepository.create(createUserDto);

    return this.userRepository.save(userEntity);
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.userRepository.delete(id);
  }

  async getEntityById(userId: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findById(userId);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async getEntityMeById(userId: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findAndJoin(userId);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async getEntityByEmail(email: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findByEmail(email);

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    if (userEntity.status === UserStatusEnum.BLOCKED) {
      throw new BlockedUserFoundException();
    }

    return userEntity;
  }

  async resetPassword(userId: string, password: string): Promise<UserEntity> {
    const userEntity = await this.getEntityById(userId);

    this.userRepository.merge(userEntity, {
      password: await UtilsProvider.generateHash(password),
    });

    return userEntity;
  }
}
