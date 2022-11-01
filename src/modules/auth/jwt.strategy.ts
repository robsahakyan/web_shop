import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { ApiConfigService } from "../../shared/services/api-config.service";
import { UserService } from "../user/user.service";
import { UserUnauthorizedException } from "./exceptions/user-unauthorized.exception";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ApiConfigService,
    public readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }

  async validate({ iat, exp, id: userId }) {
    const timeDiff = exp - iat;

    if (timeDiff <= 0) {
      const description = "timeout";

      throw new UserUnauthorizedException(description);
    }

    try {
      return (await this.userService.getEntityById(userId)).toDto();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new UserUnauthorizedException(error.description);
    }
  }
}
