import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { get } from 'http';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) { }


    @Get()
    getAdmins() {
        return this.adminService.getAdmins();
    }




}
