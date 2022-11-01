import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
