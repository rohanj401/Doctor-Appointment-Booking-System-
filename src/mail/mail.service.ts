import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('process.env', process.env);
    this.transporter = nodemailer.createTransport({
      port: 587,
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });
  }
  async sendMail(
    from: string,
    to: string,
    subject: string,
    text: string,
    htmlContent?: string ,
    // =  '<p>Default HTML content</p>'
  ): Promise<void> {
    console.log('Sending email toooooooooooooooo', to);
    console.log('Subject:', subject);
    console.log('Text:', text);
    const mailBody = 'name';
    console.log('from:', from);
    await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: htmlContent,
    });
  }
}
