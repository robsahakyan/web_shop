import { Repository } from 'typeorm';

import { TokenTypeEnum } from '../../constants/token-type.enum';
import { CustomRepository } from '../../db/typeorm-ex.decorator';
import { UserTokenEntity } from './user-token.entity';

@CustomRepository(UserTokenEntity)
export class UserTokenRepository extends Repository<UserTokenEntity> {
  async findByUserId(userId: string): Promise<UserTokenEntity | null> {
    return this.findOne({ where: { userId } });
  }

  async findUserForgotTokenByEmail(
    email: string,
  ): Promise<UserTokenEntity | null> {
    return this.createQueryBuilder('userToken')
      .where('userToken.userEmail = :email', { email })
      .andWhere('userToken.type = :type', {
        type: TokenTypeEnum.FORGOT_PASSWORD,
      })
      .getOne();
  }
}
