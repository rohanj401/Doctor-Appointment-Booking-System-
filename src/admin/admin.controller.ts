import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @Post('/verifyDoctor/:id')
  @UseGuards(AuthGuard)
  verifyDoctor(@Param('id') id: string) {
    // console.log('admin controller');
    return this.adminService.verifyDoctor(id);
  }
}
