import { BadRequestException } from '@nestjs/common';

export class BlockedUserFoundException extends BadRequestException {
  constructor() {
    super('blocked_user_found', 'Blocked user found');
  }
}
