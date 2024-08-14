import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  role: string;
  @Expose()
  is_verified: string;
  @Expose()
  isEmailVerified: string;
}
