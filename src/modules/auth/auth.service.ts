import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/schemas/user.schema';
import { TOKEN_MESSAGES, USERS_MESSAGES } from '../../constants/message';
import { generateHash, validateHash } from '../../common/utils';
import { IOAuthRequest, IUserRequest } from '../../interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenInvalidException } from '../../exceptions';
import { MailsService } from '../mails/mails.service';
import { ResendConfirmEmailDto } from './dto/resend-confirm-email.dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailsService: MailsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const checkExistEmail = await this.isEmailTaken(email);

    if (checkExistEmail)
      throw new BadRequestException(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);

    const securedPassword = generateHash(password);

    const verifyEmailToken = this.signEmailConfirmToken(email);

    await this.sendVerificationLink({
      email: registerDto.email,
      name: registerDto.name,
      token: verifyEmailToken,
    });

    await this.prisma.user.create({
      data: {
        ...registerDto,
        password: securedPassword,
        verifyEmailToken,
      },
    });

    return {
      message: USERS_MESSAGES.REGISTER_SUCCESSFUL,
    };
  }

  private signEmailConfirmToken(email: string) {
    return this.jwtService.sign(
      { email },
      {
        secret: this.config.getOrThrow('mail.jwtMailSecret'),
        expiresIn: `${this.config.getOrThrow('mail.jwtMailExpires')}s`,
      },
    );
  }

  async login(req: IUserRequest) {
    const user: User = req.user;

    const accessToken = this.signAccessToken({
      userId: user.id,
      email: user.email,
      verifyStatus: true,
    });

    const refreshToken = this.signRefreshToken({
      userId: user.id,
      email: user.email,
      verifyStatus: true,
    });

    await this.updateRefreshToken(user.id.toString(), refreshToken);

    return {
      message: USERS_MESSAGES.LOGIN_SUCCESSFUL,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async loginGoogle(req: IOAuthRequest) {
    const { profile } = req.user;
    const email = profile.emails[0].value;
    const existingUser = await this.findUserByEmail(email);

    let user: { email: string; userId: string };

    if (!existingUser) {
      const securedPassword = generateHash('password123');
      const newUser = await this.prisma.user.create({
        data: {
          name: profile.displayName,
          email,
          password: securedPassword,
        },
      });

      user = {
        userId: newUser.id,
        email: email,
      };
    } else {
      user = {
        userId: existingUser.id,
        email: email,
      };
    }

    const accessToken = this.signAccessToken({
      ...user,
      verifyStatus: true,
    });

    const refreshToken = this.signRefreshToken({
      ...user,
      verifyStatus: true,
    });

    await this.updateRefreshToken(user.userId.toString(), refreshToken);

    const frontendURL = this.config.getOrThrow('app.frontendURL');

    return `${frontendURL}/login?access_token=${accessToken}&refresh_token=${refreshToken}`;
  }

  async loginFacebook(req: IOAuthRequest) {
    const { profile } = req.user;
    const email = profile.emails[0].value;
    const existingUser = await this.findUserByEmail(email);

    let user: { email: string; userId: string };

    if (!existingUser) {
      const securedPassword = generateHash('password123');
      const newUser = await this.prisma.user.create({
        data: {
          name: `${profile.name.familyName} ${profile.name.middleName} ${profile.name.givenName}`,
          email: email, // Email từ biến
          password: securedPassword, // Mật khẩu đã mã hóa
        },
      });

      user = {
        userId: newUser.id,
        email: email,
      };
    } else {
      user = {
        userId: existingUser.id,
        email: email,
      };
    }

    const accessToken = this.signAccessToken({
      ...user,
      verifyStatus: true,
    });

    const refreshToken = this.signRefreshToken({
      ...user,
      verifyStatus: true,
    });

    await this.updateRefreshToken(user.userId.toString(), refreshToken);

    const frontendURL = this.config.getOrThrow('app.frontendURL');

    return `${frontendURL}/login?access_token=${accessToken}&refresh_token=${refreshToken}`;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload: {
        id: string;
        email: string;
      } = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.config.getOrThrow<string>('auth.refreshTokenSecret'),
        ignoreExpiration: false,
      });

      const user = await this.findUserByEmail(payload.email);
      if (!user || !user.refreshToken)
        throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
      const refreshTokenMatches = await validateHash(
        refreshTokenDto.refreshToken,
        user.refreshToken,
      );
      if (!refreshTokenMatches)
        throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);

      // all good
      const accessToken = this.signAccessToken({
        userId: payload.id,
        email: payload.email,
        verifyStatus: true,
      });

      return {
        message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESSFULLY,
        data: {
          accessToken,
        },
      };
    } catch (error) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }
  }

  async confirmEmail(token: string) {
    try {
      const payload: {
        email: string;
      } = this.jwtService.verify(token, {
        secret: this.config.getOrThrow<string>('mail.jwtMailSecret'),
        ignoreExpiration: false,
      });

      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);

      if (user.verify)
        throw new BadRequestException(USERS_MESSAGES.ACCOUNT_IS_VERIFIED);

      await this.prisma.user.update({
        where: {
          email: payload.email,
        },
        data: {
          verify: true,
          verifyEmailToken: null,
        },
      });

      return {
        message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESSFULLY,
      };
    } catch (error) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }
  }

  async resendConfirmEmail(resendConfirmEmailDto: ResendConfirmEmailDto) {
    const user = await this.findUserByEmail(resendConfirmEmailDto.email);

    if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);

    if (user.verify)
      throw new BadRequestException(USERS_MESSAGES.ACCOUNT_IS_VERIFIED);

    const verifyEmailToken = this.signEmailConfirmToken(user.email);

    await this.sendVerificationLink({
      email: user.email,
      name: user.name,
      token: verifyEmailToken,
    });

    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        verifyEmailToken: verifyEmailToken,
      },
    });

    return {
      message: USERS_MESSAGES.RESEND_CONFIRM_EMAIL_SUCCESSFULLY,
    };
  }

  private sendVerificationLink({
    email,
    name,
    token,
  }: {
    email: string;
    name: string;
    token: string;
  }) {
    const apiPrefix =
      this.config.getOrThrow<string>('app.apiPrefix') +
      '/' +
      this.config.getOrThrow<string>('app.apiVersion');

    const verifyEmailUrl = `${this.config.getOrThrow(
      'app.appURL',
    )}/${apiPrefix}/auth/verify-email?token=${token}`;

    return this.mailsService.sendMail({
      to: email,
      from: 'movie-review-app@gmail.com',
      subject: 'Email confirmation for movie app',
      template: './verify-mail',
      context: {
        name,
        verifyUrl: verifyEmailUrl,
      },
    });
  }

  private signAccessToken({
    userId,
    email,
    verifyStatus,
  }: {
    userId: string;
    email: string;
    verifyStatus: boolean;
  }) {
    return this.jwtService.sign(
      { id: userId, email, verifyStatus },
      {
        secret: this.config.getOrThrow<string>('auth.accessTokenSecret'),
        // change expires unit to seconds
        expiresIn:
          this.config.getOrThrow<number>('auth.accessTokenExpires') + 's',
      },
    );
  }

  private signRefreshToken({
    userId,
    email,
    verifyStatus,
  }: {
    userId: string;
    email: string;
    verifyStatus: boolean;
  }) {
    return this.jwtService.sign(
      { id: userId, email, verifyStatus },
      {
        secret: this.config.getOrThrow<string>('auth.refreshTokenSecret'),
        // change expires unit to seconds
        expiresIn:
          this.config.getOrThrow<number>('auth.refreshTokenExpires') + 's',
      },
    );
  }

  private async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return Boolean(existingUser);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await generateHash(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async findUserByEmail(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return existingUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      throw new NotFoundException(
        USERS_MESSAGES.PASSWORD_OR_USERNAME_INCORRECT,
      );

    const valid = await validateHash(password, user.password);

    if (!valid)
      throw new UnauthorizedException(
        USERS_MESSAGES.PASSWORD_OR_USERNAME_INCORRECT,
      );

    return { id: user.id, email: user.email, VerifyStatus: user.verify };
  }

  async getMe(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return omit(user, [
      'password',
      'verifyEmailToken',
      'forgotPasswordToken',
      'verify',
      'refreshToken',
    ]);
  }

  async logout(email: string) {
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        refreshToken: null,
      },
    });

    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESSFUL,
    };
  }
}
