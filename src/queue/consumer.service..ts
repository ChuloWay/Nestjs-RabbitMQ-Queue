import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Channel, Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { EmailService } from 'src/mailer/mail.service';

@Injectable()
export class ConsumerAmqp {
  public static readonly channelName = 'hello';
  public static readonly emailQueueName = 'email-queue';
  private channel: Channel;

  constructor(
    @InjectAmqpConnection('RABBITMQ') private connection: Connection,
    private readonly emailService: EmailService,
  ) {}

  public async onModuleInit() {
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(ConsumerAmqp.channelName, { durable: true });
    await this.channel.assertQueue('email-queue', { durable: true });

    // Start consuming messages from the hello queue
    await this.channel.consume(
      ConsumerAmqp.channelName,
      (msg) => {
        if (msg !== null) {
          Logger.log(
            `Consumer received '${msg.content.toString()}'`,
            'Rabbitmq',
          );

          // Log messages at specific intervals
          this.logWithTimeout(msg.content.toString(), 5000);

          this.channel.ack(msg);
        }
      },
      { noAck: false },
    );

    // Start consuming messages from the email queue
    await this.channel.consume(
      'email-queue',
      async (msg) => {
        if (msg !== null) {
          try {
            Logger.log(
              `Email Consumer received '${msg.content.toString()}'`,
              'Rabbitmq',
            );

            // Parse the message content (assuming it's JSON) into an object)
            const emailData = JSON.parse(msg.content.toString());
            console.log('email data here', emailData);
            // Process email messages here, you can send emails using your email service
            const sending = await this.emailService.sendEmail(emailData);
            console.log('====Email Queue=====');
            console.log(sending);
            console.log('====Email Queue=====');

            this.channel.ack(msg);
          } catch (error) {
            // Handle any errors that occur during email sending
            Logger.error(`Error sending email: ${error.message}`, 'Rabbitmq');
            this.channel.ack(msg);
          }
        }
      },
      { noAck: false },
    );
  }

  private logWithTimeout(message: string, timeoutMs: number) {
    const logInterval = setInterval(() => {
      Logger.log(`Observed: '${message}'`, 'Rabbitmq');
    }, timeoutMs);

    setTimeout(() => {
      clearInterval(logInterval);
    }, 30000);
  }
}
