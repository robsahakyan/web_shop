import type { RoleEnum } from '../../../constants/role.enum';
import { RegisterDto } from '../../auth/dtoes/register.dto';

export class CreateUserDto extends RegisterDto {
  role: RoleEnum;
}
