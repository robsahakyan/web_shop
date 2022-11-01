import { NotAcceptableException } from '@nestjs/common';

export class ForgotPasswordTokenNotFoundException extends NotAcceptableException {
  constructor() {
    super('forgot password token not found');
  }
}
