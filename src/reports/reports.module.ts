import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reports } from 'src/schemas/Reports.schema';
import { ReportsSchema } from 'src/schemas/Reports.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: Reports.name, schema: ReportsSchema }])],
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}
