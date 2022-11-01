import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleEnum } from '../../constants/role.enum';
import { Auth } from '../../decorators/http.decorators';
import { PaymentService } from './payment.service';

@Controller('payment')
@ApiTags('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('capture-order')
  async captureOrder(@Query() query: string) {
    return this.paymentService.captureOrder(query);
  }

  @Get('cancel-payment')
  cancelPayment() {
    return this.paymentService.cancelOrder();
  }

  @Auth(RoleEnum.ADMIN)
  @Post(':captureId/refund')
  async refundAmount(@Param('captureId') captureId: string) {
    return this.paymentService.refundAmount(captureId);
  }
}
