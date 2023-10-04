import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';

@Injectable()
export class ProducerService {
  constructor(
    @InjectAmqpConnection('RABBITMQ') private readonly amqp: Connection,
  ) {}

  async sendMessagesToQueue(queue: string, messages: string[]) {
    const channel = await this.amqp.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    for (const message of messages) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          channel.sendToQueue(queue, Buffer.from(message));
          console.log(` [x] Sent to queue '${queue}': ${message}`);
          resolve();
        }, 3000); // 3-second delay
      });
    }

    await channel.close();
  }

  async addToEmailQueue(mail: any) {
    try {
      console.log('mail', mail);

      // Send the email task to the RabbitMQ queue
      const channel = await this.amqp.createChannel();
      await channel.assertQueue('email-queue', { durable: true });
      channel.sendToQueue('email-queue', Buffer.from(JSON.stringify(mail)), {
        persistent: true,
      });
      Logger.log('Sent To Queue');
    } catch (error) {
      console.error('Error adding mail to queue', error);
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
