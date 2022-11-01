import { NotFoundException } from '@nestjs/common';

export class TargetNotFoundException extends NotFoundException {
  constructor() {
    super('error', 'can not found Target');
  }
}
