import { Injectable } from '@nestjs/common';
import { RoleGuard } from './roles.guard';

@Injectable()
export class DoctorGuard extends RoleGuard {
  role = 'doctor'; // Set the role as 'doctor'
}
