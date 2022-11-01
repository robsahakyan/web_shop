import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { firstValueFrom } from 'rxjs';

import { AddressStatusEnum } from '../../constants/address-status.enum';
import { PaymentMethodEnum } from '../../constants/payment-method.enum';
import type { ProductDto } from '../common/modules/product/product.dto';
import type { UserDto } from '../common/modules/user/user.dto';
import type { CreateOrderDto } from '../order/dtoes/create-order.dto';
import type { OrderItemDto } from '../order/dtoes/order-item.dto';
import { OrderRepository } from '../order/order.repository';
import { OrderProductRepository } from '../order/order-product.repository';
import { AddressRepository } from '../user/address.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly httpService: HttpService,
    private readonly orderRepository: OrderRepository,
    private readonly orderProductReposytory: OrderProductRepository,
    private readonly addressRepository: AddressRepository,
  ) {}

  async createOrder(
    total: number,
    productsArray: ProductDto[] | OrderItemDto[],
    user: UserDto,
    orderDto: CreateOrderDto,
  ) {
    if (orderDto.paymentMethod === PaymentMethodEnum.FOR_CACHE) {
      const addressCredetentials = orderDto.addressCredetentials;

      const addressSaver = await this.addressRepository.save({
        ...addressCredetentials,
        userId: user.id,
        name: user.fullName,
        status: orderDto.saveAddress
          ? AddressStatusEnum.USER_OWN_ADDRESS
          : AddressStatusEnum.FOR_SHIPPING,
      });
      const initialOrder = await this.orderRepository.save({
        user,
        summary: Number(total),
        address: addressSaver,
        receiverPhoneNumber: addressCredetentials.phoneNumber,
        receiverFullname: orderDto.receiverFullName || user.fullName,
        extraInformation: orderDto.extraInformation,
      });
      productsArray.map(async (item: ProductDto & OrderItemDto) =>
        this.orderProductReposytory.save({
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          product: item,
          order: initialOrder,
        }),
      );

      return initialOrder;
    }

    try {
      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: total,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: total,
                },
              },
            },
            items: productsArray.map((item) => ({
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price,
              },
              quantity: item.quantity,
            })),
          },
        ],
        application_context: {
          brand_name: 'jpit.am',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${process.env.APP_HOST}/payment/capture-order`,
          cancel_url: `${process.env.APP_HOST}/payment/cancel-payment`,
        },
      };

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const {
        data: { access_token },
      } = await firstValueFrom(
        this.httpService.post(
          'https://api-m.sandbox.paypal.com/v1/oauth2/token',
          params,
          {
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_CLIENT_SECRET,
            },
          },
        ),
      );

      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.PAYPAL_API}/v2/checkout/orders`,
          order,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        ),
      );

      const obj = {
        user,
        products: productsArray,
        orderDto,
      };

      await this.redis.set(response.data.id, JSON.stringify(obj));

      return response.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async captureOrder(query) {
    const { token } = query;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.PAYPAL_API}/v2/checkout/orders/${token}/capture`,
          {},
          {
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_CLIENT_SECRET,
            },
          },
        ),
      );
      const paymentId = response.data.id;
      const getFinalResponse = await firstValueFrom(
        this.httpService.get(
          `${process.env.PAYPAL_API}/v2/checkout/orders/${paymentId}`,
          {
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_CLIENT_SECRET,
            },
          },
        ),
      );
      const summary = getFinalResponse.data.purchase_units[0].amount.value;
      const orderObject = JSON.parse(await this.redis.get(token));
      const addressCredetentials = orderObject.orderDto.addressCredetentials;
      const addressSaver = await this.addressRepository.save({
        ...addressCredetentials,
        userId: orderObject.user.id,
        name: orderObject.user.fullName,
        status: orderObject.orderDto.saveAddress
          ? AddressStatusEnum.USER_OWN_ADDRESS
          : AddressStatusEnum.FOR_SHIPPING,
      });
      const initialOrder = await this.orderRepository.save({
        user: orderObject.user,
        paymentId: response.data.purchase_units[0].payments.captures[0].id,
        summary: Number(summary),
        address: addressSaver,
        paymentMethod: PaymentMethodEnum.FOR_PAYPAL,
        status: getFinalResponse.data.status,
        receiverPhoneNumber: addressCredetentials.phoneNumber,
        receiverFullname:
          orderObject.orderDto.receiverFullname || orderObject.user.fullName,
        extraInformation: orderObject.orderDto.extraInformation,
      });
      await orderObject.products.map(async (item: ProductDto & OrderItemDto) =>
        this.orderProductReposytory.save({
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          product: item,
          order: initialOrder,
        }),
      );
      await this.redis.del(token);

      return response.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  cancelOrder() {
    return 'order canceled';
  }

  async refundAmount(captureId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.PAYPAL_API}/v2/payments/captures/${captureId}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_CLIENT_SECRET,
            },
          },
        ),
      );

      const params = {
        amount: {
          value: response.data.amount.value,
          currency_code: 'USD',
        },
        invoice_id: `INVOICE-${captureId}`,
        note_to_payer: 'Defective product',
      };
      const postRefund = await firstValueFrom(
        this.httpService.post(
          `${process.env.PAYPAL_API}/v2/payments/captures/${captureId}/refund`,
          params,
          {
            headers: {
              'Content-Type': 'application/json',
              'PayPal-Request-Id': captureId,
            },
            auth: {
              username: process.env.PAYPAL_CLIENT_ID,
              password: process.env.PAYPAL_CLIENT_SECRET,
            },
          },
        ),
      );
      const order = await this.orderRepository.findOneByPaymentId(captureId);

      await this.orderRepository.update(order.id, { status: 'REFUNDED' });

      return postRefund.data;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
