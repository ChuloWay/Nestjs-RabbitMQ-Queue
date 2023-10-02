import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';

@Injectable()
export class ConsumerAmqp implements OnModuleInit {
  public static readonly channelName = 'hello';

  constructor(
    @InjectAmqpConnection('RABBITMQ') private connection: Connection,
  ) {}

  public async onModuleInit() {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(ConsumerAmqp.channelName, { durable: true });
    await channel.consume(
      ConsumerAmqp.channelName,
      (msg) => {
        if (msg !== null) {
          Logger.log(
            `Consumer received '${msg.content.toString()}'`,
            'Rabbitmq',
          );

          // Log messages at specific intervals
          // this.logWithTimeout(msg.content.toString(), 5000);

          channel.ack(msg);
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
