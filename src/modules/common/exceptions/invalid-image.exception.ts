import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidImageException extends UnprocessableEntityException {
  constructor() {
    super('invalid image');
  }
}
