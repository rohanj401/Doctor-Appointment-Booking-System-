import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/schemas/User.schema';

@Injectable()
export abstract class RoleGuard implements CanActivate {
  abstract role: string;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    console.log(user.role, '  ', this.role);
    if (!user || user.role !== this.role) {
      throw new UnauthorizedException(
        `Only ${this.role} role is allowed to access this resource.`,
      );
    }
    return true;
  }
}
