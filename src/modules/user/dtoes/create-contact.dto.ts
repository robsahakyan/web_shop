import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Invalide Email address' })
  email: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  message: string;
}
