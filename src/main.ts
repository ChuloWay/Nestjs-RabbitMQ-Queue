import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

require('dotenv').config();

async function bootstrap() {
  const logger = new Logger('Main');
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  await app
    .listen(port)
    .then(() =>
      logger.log(`Sample Queue Server is Listening at: localhost:${port}`),
    )
    .catch((err) => {
      logger.error('>>> App error: ', err);
    });
}

bootstrap();
