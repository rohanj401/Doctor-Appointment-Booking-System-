import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // or another email service
      auth: {
        user: '', 
        pass: '', 
      },
    });
  }

  async sendMail(from: string,to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
    });
  }
}
