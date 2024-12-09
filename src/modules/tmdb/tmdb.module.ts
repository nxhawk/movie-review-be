import { Module } from '@nestjs/common';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        baseURL: config.getOrThrow('tmdb.endpoint'),
        timeout: 30000,
        headers: {
          Authorization: `Bearer ${config.getOrThrow('tmdb.apiKey')}`,
          Accept: 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TmdbController],
  providers: [TmdbService],
})
export class TmdbModule {}
