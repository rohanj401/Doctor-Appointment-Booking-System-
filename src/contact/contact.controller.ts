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
    console.log(' ******************** Inside contorller ************');
    const { name, email, subject, message } = body;
    // const fullMessage = `${message}`;
    // console.log('FULL Message is ', fullMessage);
    const fullMessage = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;
    // name: ${name} <br>email: ${email}<br>subject: ${subject}<br>message: ${message}

    // Create HTML content for better formatting
    const htmlContent = `
     
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    await this.mailService.sendMail(
      email,
      process.env.USER,
      subject,
      fullMessage,
      htmlContent,
    );
    return { status: 'success' };
  }
}
