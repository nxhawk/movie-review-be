import { IsString, ValidateIf } from 'class-validator';

import { DatabaseConfig } from './config.type';
import { registerAs } from '@nestjs/config';
import { validateConfig } from '../common/utils';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.MONGODB_URI)
  @IsString()
  MONGODB_URI: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    mongodbUri: process.env.MONGODB_URI,
  };
});
