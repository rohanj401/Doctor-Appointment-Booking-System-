import { Controller, Get, Param } from '@nestjs/common';
import { get } from 'http';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) { }


    @Get()
    getAdmins() {
        return this.adminService.getAdmins();
    }

    // @Get('/fetchadminByUserId/:id')
    // async fetchPatientByUserId(@Param('id') id: string) {
    //     return this.adminService.fetchAdminByUserId(id);
    // }



}
