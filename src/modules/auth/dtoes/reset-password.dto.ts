import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IsPassword } from '../../../decorators/validators.decorators';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsPassword()
  newPassword: string;
}
