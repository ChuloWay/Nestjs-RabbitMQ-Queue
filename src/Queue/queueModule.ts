import { Module } from '@nestjs/common';
import { AmqpModule } from 'nestjs-amqp';
import { ConsumerAmqp } from './consumer.service.';
import { ProducerService } from './producer.service';

@Module({
  imports: [
    AmqpModule.forRoot({
      name: 'RABBITMQ',
    }),
  ],
  providers: [ConsumerAmqp, ProducerService],
  exports: [ProducerService]
})
export class QueueModule {}
