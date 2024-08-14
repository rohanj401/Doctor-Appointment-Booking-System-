// reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reports} from 'src/schemas/Reports.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Reports.name) private reportModel: Model<Reports>) {}

  async createReport(createReportDto: CreateReportDto): Promise<Reports> {
    const createdReport = new this.reportModel(createReportDto);
    return createdReport.save();
  }

  async deleteReport(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }
}
