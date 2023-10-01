import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmqpModule } from 'nestjs-amqp';
import { QueueModule } from './Queue/queueModule';
import config from './utils/config';

@Module({
  imports: [
    AmqpModule.forRoot({
      name: config.rabbitmq.name,
      hostname: config.rabbitmq.hostname,
      port: config.rabbitmq.rabbitMqport,
    }),
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
