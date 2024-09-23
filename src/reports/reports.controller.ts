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
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @Body() createReportDto: CreateReportDto,
  ): Promise<Reports> {
    return this.reportsService.createReport(createReportDto);
  }
  @Get()
  @UseGuards(AuthGuard)
  async getReports(@Query('filter') filter: string): Promise<any[]> {
    const query = filter ? JSON.parse(filter) : {};
    console.log('query selctor is ', query);
    return this.reportsService.getReports(query);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReport(@Param('id') id: string): Promise<void> {
    return this.reportsService.deleteReport(id);
  }
}
