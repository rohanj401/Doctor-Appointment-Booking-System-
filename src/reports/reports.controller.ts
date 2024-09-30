// reports.controller.ts
import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from 'src/schemas/Reports.schema';
import { AuthGuard } from 'src/auth/auth.gaurd';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/guards/role.enum';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(Role.Patient)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Reports> {
    return this.reportsService.createReport(createReportDto);
  }
  @Get()
  @Roles(Role.Doctor, Role.Patient)
  async getReports(@Query('filter') filter: string): Promise<any[]> {
    const query = filter ? JSON.parse(filter) : {};
    console.log('query selctor is ', query);
    return this.reportsService.getReports(query);
  }
  @Delete(':id')
  @Roles(Role.Patient)
  async deleteReport(@Param('id') id: string): Promise<void> {
    return this.reportsService.deleteReport(id);
  }
}
