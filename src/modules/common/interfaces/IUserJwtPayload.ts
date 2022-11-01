import type { TokenTypeEnum } from '../../../constants/token-type.enum';

export interface IUserJwtPayload {
  id: string;
  type: TokenTypeEnum;
}
