import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class OrderItemDto {
  catch(arg0: () => never) {
    throw new Error('Method not implemented.');
  }

  @ApiProperty()
  @IsNumber()
  code: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}
