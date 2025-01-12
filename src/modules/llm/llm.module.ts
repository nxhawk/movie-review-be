import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.getOrThrow('llm.endpoint'),
        timeout: 30000,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LlmController],
  providers: [LlmService],
})
export class LlmModule {}
