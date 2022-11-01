import type { TokenTypeEnum } from '../../../constants/token-type.enum';

export class UpsertUserTokenDto {
  userId: string;

  token: string;

  type: TokenTypeEnum;
}
