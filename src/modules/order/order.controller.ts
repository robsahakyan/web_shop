import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RoleEnum } from '../../constants/role.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth, UUIDParam } from '../../decorators/http.decorators';
import type { OrderDto } from '../common/modules/order/order.dto';
import { UserDto } from '../common/modules/user/user.dto';
import { CreateOrderDto } from './dtoes/create-order.dto';
import { UpdateOrderStatusDto } from './dtoes/update-order-status.dto';
import { OrderService } from './order.service';

@Controller('orders')
@ApiTags('orders')
export class OrderController {
  constructor(public readonly orderService: OrderService) {}

  @Auth(RoleEnum.CUSTOMER)
  @Post()
  async createCart(
    @Body() orderDto: CreateOrderDto,
    @AuthUser() user: UserDto,
  ) {
    return this.orderService.createCart(orderDto, user);
  }

  @Auth(RoleEnum.ADMIN)
  @Get()
  async getAll(): Promise<OrderDto[]> {
    return this.orderService.findAll();
  }

  @Auth(RoleEnum.ADMIN)
  @Get('/summary')
  async getSummary(): Promise<Record<string, number>> {
    return this.orderService.getSummary();
  }

  @Auth(RoleEnum.ADMIN)
  @Put('/update-order-status/:orderId')
  async updateSingleOrder(
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @UUIDParam('orderId') orderId: string,
  ): Promise<OrderDto> {
    return this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Get('/:orderId')
  async getSingleOrder(
    @UUIDParam('orderId') orderId: string,
  ): Promise<OrderDto> {
    return this.orderService.findOneById(orderId);
  }

  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Get(':userId')
  async getAllUserOrders(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
  ): Promise<OrderDto[]> {
    if (userId === user.id || user.role === RoleEnum.ADMIN) {
      return this.orderService.findAllUserOrders(userId);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }

  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @Get(':userId/:orderId')
  async getOneOrder(
    @AuthUser() user: UserDto,
    @UUIDParam('userId') userId: string,
    @UUIDParam('orderId') orderId: string,
  ): Promise<OrderDto> {
    if (userId === user.id || user.role === RoleEnum.ADMIN) {
      return this.orderService.findOneOrder(userId, orderId);
    }

    throw new HttpException(
      'Requested id notable your id',
      HttpStatus.FORBIDDEN,
    );
  }
}
