import { ConflictException } from '@nestjs/common';

export class ProductConflictException extends ConflictException {
  constructor() {
    super(
      'error',
      'Product data does not match or The product name is already exist',
    );
  }
}
