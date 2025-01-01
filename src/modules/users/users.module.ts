import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailsModule } from '../mails/mails.module';

@Module({
  imports: [JwtModule.register({}), MailsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
