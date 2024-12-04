import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailsService } from '../mails/mails.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { TOKEN_MESSAGES, USERS_MESSAGES } from '../../constants/message';
import { TokenInvalidException } from '../../exceptions';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { generateHash } from '../../common/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailsService: MailsService,
  ) {}

  private signForgotPasswordToken({
    userId,
    email,
  }: {
    userId: number;
    email: string;
  }) {
    return this.jwtService.sign(
      { userId, email },
      {
        secret: this.config.getOrThrow<string>('auth.jwtForgotPasswordSecret'),
        expiresIn: `${this.config.getOrThrow<string>(
          'auth.jwtForgotPasswordExpires',
        )}s`,
      },
    );
  }

  private sendForgotPasswordMail({
    email,
    token,
    name,
  }: {
    email: string;
    token: string;
    name: string;
  }) {
    const apiPrefix =
      this.config.getOrThrow<string>('app.apiPrefix') +
      '/' +
      this.config.getOrThrow<string>('app.apiVersion');
    const resetLink = `${this.config.getOrThrow(
      'app.appURL',
    )}/${apiPrefix}/users/verify/forgot-password?token=${token}`;

    return this.mailsService.sendMail({
      to: email,
      from: 'movie-review-app@gmail.com',
      subject: 'Email reset forgot password for movie app',
      template: './forgot-password',
      context: {
        name,
        verifyUrl: resetLink,
      },
    });
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);

    const token = this.signForgotPasswordToken({
      userId: user.id,
      email: user.email,
    });

    await this.userModel.updateOne(
      { email },
      { $set: { forgotPasswordToken: token } },
    );

    await this.sendForgotPasswordMail({ email, token, name: user.name });

    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD,
    };
  }

  verifyForgotPassword(token: string) {
    const frontendURL = this.config.get('app.frontendURL');
    return `${frontendURL}/reset-password?token=${token}`;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { token, password } = resetPasswordDto;
      const payload: {
        userId: number;
        email: string;
      } = this.jwtService.verify(token, {
        secret: this.config.getOrThrow<string>('auth.jwtForgotPasswordSecret'),
        ignoreExpiration: false,
      });

      const user = await this.userModel.findOne({
        email: payload.email,
      });

      if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);

      if (user.forgotPasswordToken != token)
        throw new BadRequestException(
          USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_INVALID,
        );

      await this.userModel.updateOne(
        { email: user.email },
        {
          $set: {
            password: generateHash(password),
            forgotPasswordToken: null,
          },
        },
      );

      return {
        message: USERS_MESSAGES.RESET_PASSWORD_SUCCESSFUL,
      };
    } catch (error) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }
  }
}
