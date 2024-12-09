import { IsOptional, IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';
import { validateConfig } from '../common/utils';
import { TmdbConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  THEMOVIEDB_API_KEY: string;

  @IsString()
  @IsOptional()
  THEMOVIEDB_ENDPOINT: string;
}

export default registerAs<TmdbConfig>('tmdb', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.THEMOVIEDB_API_KEY,
    endpoint: process.env.THEMOVIEDB_ENDPOINT || 'https://api.themoviedb.org/3',
  };
});
