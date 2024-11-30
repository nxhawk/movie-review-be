import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from './common/enum/node-env';
import { LogLevel } from './common/enum/logger-level';
import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';
import databaseConfig from './configs/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      cache: true,
      expandVariables: true,
      envFilePath: '.env',
      validationOptions: {
        abortEarly: false,
      },
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const logLevel =
          config.getOrThrow('app.nodeEnv') === Environment.PRODUCTION
            ? LogLevel.DEBUG
            : LogLevel.INFO;
        return {
          exclude: ['health', 'metrics'],
          pinoHttp: { level: logLevel },
          transport:
            config.getOrThrow('app.nodeEnv') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'mmm-dd h:MM:ss',
                    ignore: 'hostname',
                  },
                }
              : null,
          customLogLevel: (req: any, res: any, err: any) => {
            if (res.statusCode === 401) {
              return 'silent';
            }
            if (res.statusCode >= 400 && res.statusCode < 500) {
              return 'warn';
            } else if (res.statusCode >= 500 || err) {
              return 'error';
            }
            return 'info';
          },
        };
      },
    }),
    JwtModule.register({}),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('database.mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
