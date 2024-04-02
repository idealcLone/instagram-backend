import { User } from '../../user/entities/User.entity';

export interface UserRequest extends Request {
  user: User;
}
