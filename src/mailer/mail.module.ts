import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { EmailService } from './mail.service';

require('dotenv').config();

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Buka',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"Buka" <noreply@buka.ng>',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailServiceModule {}
