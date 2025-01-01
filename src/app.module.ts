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
import mailConfig from './configs/mail.config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailsModule } from './modules/mails/mails.module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { WatchListModule } from './modules/watch-list/watch-list.module';
import { FavoriteListModule } from './modules/favorite-list/favorite-list.module';
import { HealthModule } from './modules/health/health.module';
import tmdbConfig from './configs/tmdb.config';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, mailConfig, tmdbConfig],
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
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          host: config.getOrThrow('mail.host'),
          port: config.getOrThrow('mail.port'),
          secure: true,
          auth: {
            user: config.getOrThrow('mail.username'),
            pass: config.getOrThrow('mail.password'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({}),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow('database.mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailsModule,
    TmdbModule,
    WatchListModule,
    FavoriteListModule,
    HealthModule,
  ],
})
export class AppModule {}
