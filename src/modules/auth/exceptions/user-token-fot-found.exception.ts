import { NotFoundException } from '@nestjs/common';

export class UserTokenFotFoundException extends NotFoundException {
  constructor() {
    super('user_token_not_fount', 'User token not found');
  }
}
