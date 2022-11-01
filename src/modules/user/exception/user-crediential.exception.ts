import { BadRequestException } from '@nestjs/common';

export class UserCredientalException extends BadRequestException {
  constructor(description?: string) {
    super('error', `${description}`);
  }
}
