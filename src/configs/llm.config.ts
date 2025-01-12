import { IsOptional, IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';
import { validateConfig } from '../common/utils';
import { LlmConfig } from './config.type';

class EnvironmentVariablesValidator {
  @IsString()
  GEMINI_API_KEY: string;

  @IsString()
  @IsOptional()
  LLM_ENDPOINT: string;
}

export default registerAs<LlmConfig>('llm', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: process.env.LLM_ENDPOINT || 'https://awd-llm.azurewebsites.net',
  };
});
