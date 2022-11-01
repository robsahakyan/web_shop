import type { TokenTypeEnum } from '../../../../constants/token-type.enum';
import type { UserTokenEntity } from '../../../auth/user-token.entity';
import { AbstractDto } from '../../dtoes/abstract.dto';

export class UserTokenDto extends AbstractDto {
  userId: string;

  token: string;

  type: TokenTypeEnum;

  constructor(userTokenEntity: UserTokenEntity) {
    super(userTokenEntity);

    this.userId = userTokenEntity.userId;
    this.token = userTokenEntity.token;
    this.type = userTokenEntity.type;
  }
}
