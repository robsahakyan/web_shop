import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleEnum } from '../../constants/role.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { Auth } from '../../decorators/http.decorators';
import { LoginPayloadDto } from '../common/modules/auth/login-payload.dto';
import { UserDto } from '../common/modules/user/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtoes/forgot-password.dto';
import { LoginDto } from './dtoes/login.dto';
import { RegisterDto } from './dtoes/register.dto';
import { ResetPasswordDto } from './dtoes/reset-password.dto';

@Controller('')
@ApiTags('')
export class AuthController {
  constructor(
    public readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully login' })
  async login(@Body() loginDto: LoginDto): Promise<LoginPayloadDto> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Successfully Registered and login',
  })
  async register(@Body() registerDto: RegisterDto): Promise<LoginPayloadDto> {
    return this.authService.registerAndLogin(registerDto);
  }

  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiNoContentResponse()
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('/reset-password/:forgotPasswordToken')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Successfully reset password' })
  getResetPasswordToken(
    @Param('forgotPasswordToken') token: string,
  ): Record<'token', string> {
    return { token };
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'Successfully reset password',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Get Auth User' })
  @Auth(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  async me(@AuthUser() user: UserDto): Promise<UserDto> {
    return (await this.userService.getEntityMeById(user.id)).toDto();
  }
}
