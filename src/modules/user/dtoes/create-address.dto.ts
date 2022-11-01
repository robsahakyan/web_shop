import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString({ message: 'Address name has been Required' })
  address: string;

  @ApiProperty()
  @IsString({ message: 'City name has been Required' })
  city: string;

  @ApiProperty()
  @IsPhoneNumber('AM', { message: 'Phone has been Valid Phone number' })
  phoneNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  apartment?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  entrance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  intercom?: number;
}
