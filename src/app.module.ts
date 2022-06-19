import { Module } from '@nestjs/common';
import { CensusModule } from './census/census.module';
import { ConfigModule } from '@census-reworked/nestjs-utils';
import { AppConfig } from './app.config';

@Module({
  imports: [ConfigModule.forFeature([AppConfig]), CensusModule],
})
export class AppModule {}
