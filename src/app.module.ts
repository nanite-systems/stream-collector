import { Module } from '@nestjs/common';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';
import { PublisherModule } from './publisher/publisher.module';

@Module({
  imports: [ConfigModule.forFeature([AppConfig]), PublisherModule],
})
export class AppModule {}
