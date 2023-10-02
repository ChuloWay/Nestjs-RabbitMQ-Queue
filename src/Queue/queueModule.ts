import { Module } from '@nestjs/common';
import { AmqpModule } from 'nestjs-amqp';
import { ConsumerAmqp } from './consumer.service.';
import { ProducerService } from './producer.service';
import config from '../utils/config';

@Module({
  imports: [
    AmqpModule.forRoot({
      name: config.rabbitmq.name,
    }),
  ],
  providers: [ConsumerAmqp, ProducerService],
  exports: [ProducerService]
})
export class QueueModule {}
