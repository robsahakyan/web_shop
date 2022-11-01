import { ApiProperty } from '@nestjs/swagger';

import { IsPassword } from '../../../decorators/validators.decorators';

export class UpdateUserPassword {
  @ApiProperty()
  @IsPassword()
  oldPassword: string;

  @ApiProperty()
  @IsPassword()
  newPassword: string;

  @ApiProperty()
  @IsPassword()
  confirmPassword: string;
}
