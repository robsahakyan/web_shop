import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { RoleEnum } from "../../constants/role.enum";
import { TokenTypeEnum } from "../../constants/token-type.enum";
import { UtilsProvider } from "../../providers/utils.provider";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { MailService } from "../../shared/services/mail.service";
import type { IGenerateJWTOptions } from "../common/interfaces/IGenerateJWTOptions";
import type { LoginPayloadDto } from "../common/modules/auth/login-payload.dto";
import type { TokenPayloadDto } from "../common/modules/auth/token-payload.dto";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import type { ForgotPasswordDto } from "./dtoes/forgot-password.dto";
import type { LoginDto } from "./dtoes/login.dto";
import type { RegisterDto } from "./dtoes/register.dto";
import type { ResetPasswordDto } from "./dtoes/reset-password.dto";
import { ForgotPasswordTokenNotFoundException } from "./exceptions/forgot-password-token-not-found.exception";
import { UserUnauthenticatedException } from "./exceptions/user-unauthenticated.exception";
import { UserTokenService } from "./user-token.service";

@Injectable()
export class AuthService {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ApiConfigService,
    public readonly userService: UserService,
    private readonly userTokenService: UserTokenService,
    private readonly mailService: MailService
  ) {}

  async generateToken(options: IGenerateJWTOptions): Promise<TokenPayloadDto> {
    return options.expiresIn
      ? {
          expiresIn: options.expiresIn,
          token: await this.jwtService.signAsync(options.payload, {
            expiresIn: options.expiresIn,
          }),
        }
      : {
          expiresIn: options.expiresIn,
          token: await this.jwtService.signAsync(options.payload),
        };
  }

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const userEntity = await this.userService.getEntityByEmail(loginDto.email);
    const isPasswordValid = await UtilsProvider.validateHash(
      loginDto.password,
      userEntity.password
    );

    if (!isPasswordValid) {
      const description = "password is an invalid";

      throw new UserUnauthenticatedException(description);
    }

    return userEntity;
  }

  async login(userInfo: LoginDto | UserEntity): Promise<LoginPayloadDto> {
    const userEntity =
      userInfo instanceof UserEntity
        ? userInfo
        : await this.validateUser(userInfo);

    const token = await this.generateToken({
      payload: { id: userEntity.id, type: TokenTypeEnum.AUTH },
      expiresIn: this.configService.authConfig.jwtExpirationTime,
    });
    const user = userEntity.toDto();

    return { user, token };
  }

  async registerAndLogin(registerDto: RegisterDto): Promise<LoginPayloadDto> {
    let userEntity: UserEntity;

    try {
      userEntity = await this.userService.create({
        ...registerDto,
        role: RoleEnum.CUSTOMER,
      });
    } catch (error) {
      //TODO ANUSH EXBAYRNER HANDLE THIS ERROR
      console.log(error);

      throw new UserUnauthenticatedException("error");
    }

    return this.login(userEntity);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const userEntity = await this.userService.getEntityByEmail(
      forgotPasswordDto.email
    );
    const tokenPayload = await this.generateToken({
      payload: { id: userEntity.id, type: TokenTypeEnum.FORGOT_PASSWORD },
    });
    await this.userTokenService.upsert({
      userId: userEntity.id,
      token: tokenPayload.token,
      type: TokenTypeEnum.FORGOT_PASSWORD,
    });

    const url = this.configService.resetPasswordUrl + tokenPayload.token;

    await this.mailService.send({
      to: userEntity.email,
      from: "info@jpit.am",
      subject: "forgot password",
      html: this.mailService.mailHtml(userEntity.fullName, url),
    });
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<LoginPayloadDto> {
    const payload = await this.jwtService.verify(resetPasswordDto.token, {
      secret: this.configService.jwtConfig.secret,
    });

    const userToken = await this.userTokenService.getById(
      payload.id as keyof LoginPayloadDto
    );

    if (
      payload.type !== TokenTypeEnum.FORGOT_PASSWORD ||
      payload.type !== userToken.type
    ) {
      throw new ForgotPasswordTokenNotFoundException();
    }

    const userEntity = await this.userService.resetPassword(
      userToken.userId,
      resetPasswordDto.newPassword
    );

    await this.userTokenService.delete(userToken.id);

    return this.login(userEntity);
  }
}
