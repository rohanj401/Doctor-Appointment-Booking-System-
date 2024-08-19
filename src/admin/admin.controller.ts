import { Controller, Get } from '@nestjs/common';
import { get } from 'http';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) { }


    @Get()
    getDoctors() {
        return this.adminService.getAdmins();
    }
}
