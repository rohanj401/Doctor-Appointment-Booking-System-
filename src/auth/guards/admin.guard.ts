import { Injectable } from '@nestjs/common';
import { RoleGuard } from './roles.guard';

@Injectable()
export class AdminGuard extends RoleGuard {
  role = 'admin'; // Set the role as 'admin'
}
