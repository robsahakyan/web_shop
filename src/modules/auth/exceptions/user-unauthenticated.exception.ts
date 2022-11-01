import { BadRequestException } from '@nestjs/common';

export class UserUnauthenticatedException extends BadRequestException {
  constructor(description?: string) {
    super('error', `can not authenticate User. ${description}`);
  }
}
