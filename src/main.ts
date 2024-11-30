import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from './common/enum/node-env';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { setupSwagger } from './swagger/setup-swagger';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true, bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('app.port') || 3001;
  const apiPrefix =
    configService.getOrThrow<string>('app.apiPrefix') +
    '/' +
    configService.getOrThrow<string>('app.apiVersion');
  const isDocumentEnabled = configService.getOrThrow<boolean>(
    'app.documentEnabled',
  );
  const isDevelopment =
    configService.getOrThrow<string>('app.nodeEnv') === Environment.DEVELOPMENT;

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();
  app.useLogger(app.get(Logger));
  app.enableVersioning();
  app.setGlobalPrefix(apiPrefix, { exclude: ['health', 'metrics'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove all non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  //Swagger
  if (isDocumentEnabled) {
    setupSwagger(app, configService);
  }

  //Enable shutdown hooks
  if (!isDevelopment) {
    app.enableShutdownHooks();
  }

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

  return app;
}
bootstrap();
