import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendContactMessage(
    @Body()
    body: {
      name: string;
      email: string;
      subject: string;
      message: string;
    },
  ) {
    const { name, email, subject, message } = body;
    const fullMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;

    await this.mailService.sendMail(
      email,
      'aishwaryar@valueaddsofttech.com',
      subject,
      fullMessage,
    );
    return { status: 'success' };
  }
}
