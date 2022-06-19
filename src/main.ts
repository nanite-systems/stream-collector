import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';

async function bootstrap() {
  ConfigModule.forRoot();

  const app = await NestFactory.createApplicationContext(AppModule);
  const config = await app.resolve(AppConfig);

  app.useLogger(config.logLevels);
  app.enableShutdownHooks();
}

void bootstrap();
