import { UnauthorizedException } from '@nestjs/common';

export class UserUnauthorizedException extends UnauthorizedException {
  constructor(description?: string) {
    super('error', `can not authorize User. ${description}`);
  }
}
