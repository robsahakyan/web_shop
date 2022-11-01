import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { GenderEnum } from '../../../constants/gender.enum';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('AM', { message: 'Phone has been Valid Phone number' })
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  gender?: GenderEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthday?: Date;
}
