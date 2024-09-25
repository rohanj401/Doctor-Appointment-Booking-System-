import { Injectable } from '@nestjs/common';
import { RoleGuard } from './roles.guard';

@Injectable()
export class PatientGuard extends RoleGuard {
  role = 'patient'; // Set the role as 'patient'
}
