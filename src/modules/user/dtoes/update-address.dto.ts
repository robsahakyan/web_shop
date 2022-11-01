import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address: string;

  @ApiPropertyOptional()
  @IsOptional()
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
