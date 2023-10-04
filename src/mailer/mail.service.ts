import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(options: {
    email: string;
    subject: any;
    message: any;
    html: any;
  }) {
    try {
      const message = {
        to: options.email,
        subject: options.subject,
        html: options.message || options.html,
      };
      Logger.log('message', message);

      const emailSend = await this.mailerService.sendMail({
        ...message,
      });
      console.log('email sent here');
      return emailSend;
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
