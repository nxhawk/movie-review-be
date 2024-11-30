import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { registerAs } from '@nestjs/config';
import { AppConfig } from './config.type';
import { Environment } from '../common/enum/node-env';
import { validateConfig } from '../common/utils';

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  API_VERSION: string;

  @IsBoolean()
  @IsOptional()
  DOCUMENT_ENABLED: boolean;

  @IsString()
  @IsOptional()
  APP_URL: string;

  @IsString()
  @IsOptional()
  FRONTEND_URL: string;

  @IsString()
  @IsOptional()
  ADMIN_FRONTEND_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',
    documentEnabled: process.env.DOCUMENT_ENABLED === 'true',
    appURL: process.env.APP_URL || 'http://localhost:3001',
    frontendURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    adminFrontendURL:
      process.env.ADMIN_FRONTEND_URL || 'http://localhost:3030/admin',
  };
});
