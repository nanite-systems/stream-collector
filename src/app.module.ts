import { Module } from '@nestjs/common';
import { CensusModule } from './census/census.module';

@Module({
  imports: [CensusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
