import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { TypeOrmModuleOptions } from "@nestjs/typeorm";

import type { IJwtConfig } from "../../modules/common/interfaces/IJwtConfig";
import { SnakeNamingStrategy } from "../../strategies/snake-naming.strategy";

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string): number {
    return Number(this.configService.get(key));
  }

  private getString(key: string, defaultValue?: string): string {
    return this.configService
      .get(key, defaultValue)
      .toString()
      .replace(/\\n/g, "\n");
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    return {
      entities: [__dirname + "/../../modules/**/*.entity{.ts,.js}"],
      migrations: [__dirname + "/../../migrations/*{.ts,.js}"],
      type: "postgres",
      host: this.getString("DB_HOST"),
      port: this.getNumber("DB_PORT"),
      username: this.getString("DB_USERNAME"),
      password: this.getString("DB_PASSWORD"),
      database: this.getString("DB_DATABASE"),
      migrationsRun: true,
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get authConfig() {
    return {
      jwtSecret: this.getString("JWT_SECRET_KEY"),
      jwtExpirationTime: this.getNumber("JWT_EXPIRATION_TIME"),
    };
  }

  get appConfig() {
    return {
      port: this.getNumber("APP_PORT"),
    };
  }

  get jwtConfig(): IJwtConfig {
    return {
      secret: this.getString("JWT_SECRET_KEY"),
      accessTokenExpiry: this.getNumber("ACCESS_TOKEN_EXPIRATION_TIME"),
      refreshTimeExpiry: this.getNumber("REFRESH_EXPIRATION_TIME"),
    };
  }

  get mailConfig() {
    return {
      transport: {
        service: this.getString("MAIL_SERVICE"),
        auth: {
          user: this.getString("MAIL_USER"),
          pass: this.getString("MAIL_PASSWORD"),
        },
      },
    };
  }

  get defoultMailFrom() {
    return this.getString("MAIL_FROM");
  }

  get resetPasswordUrl() {
    return this.getString("RESET_PASSWORD_URL");
  }
}
