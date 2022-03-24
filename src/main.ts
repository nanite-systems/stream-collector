import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config as dotenv } from 'dotenv';

async function bootstrap() {
  dotenv();

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.enableShutdownHooks();
}

void bootstrap();
