import { Injectable } from '@nestjs/common';
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
}
