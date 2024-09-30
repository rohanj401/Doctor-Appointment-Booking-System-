import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @Post('/verifyDoctor/:id')
  @Roles(Role.Admin)
  verifyDoctor(@Param('id') id: string) {
    return this.adminService.verifyDoctor(id);
  }
}
