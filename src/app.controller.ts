import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'amqplib';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { ProducerService } from './queue/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectAmqpConnection('RABBITMQ')
    private readonly amqp: Connection,
    private readonly producerService: ProducerService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('rabbitmq-test')
  public async sendMultipleCountryMessagesToTestQueue() {
    const queue = 'hello';
    const countries = ['France', 'Spain', 'Italy', 'Japan', 'Brazil'];

    await this.producerService.sendMessagesToQueue(queue, countries);
  }
}
