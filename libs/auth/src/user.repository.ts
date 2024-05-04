import { User } from '@app/auth/interfaces/user.interface';

export interface UserRepository {
  findById: (id: string) => Promise<User>;
  findByPhone: (phone: string) => Promise<User>;
}
