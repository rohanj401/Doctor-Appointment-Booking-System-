import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get()
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @UseGuards(AdminGuard)
  @Post('/verifyDoctor/:id')
  verifyDoctor(@Param('id') id: string) {
    return this.adminService.verifyDoctor(id);
  }
}
