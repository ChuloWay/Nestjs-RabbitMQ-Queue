import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmqpModule } from 'nestjs-amqp';
import { QueueModule } from './queue/queueModule';
import config from './utils/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/db';
import { UserModule } from './user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailServiceModule } from './mailer/mail.module';

@Module({
  imports: [
    AmqpModule.forRoot({
      name: config.rabbitmq.name,
      hostname: config.rabbitmq.hostname,
      port: config.rabbitmq.rabbitMqport,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    QueueModule,
    UserModule,
    EmailServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
