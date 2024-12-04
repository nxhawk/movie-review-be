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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { TOKEN_MESSAGES, USERS_MESSAGES } from '../../constants/message';
import { generateHash, validateHash } from '../../common/utils';
import { IOAuthRequest, IUserRequest } from '../../interfaces';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenInvalidException } from '../../exceptions';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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

    await this.userModel.create({
      ...registerDto,
      password: securedPassword,
      verifyEmailToken,
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

    let user: { email: string; userId: number };

    if (!existingUser) {
      const securedPassword = generateHash('password123');
      const newUser = await this.userModel.create({
        name: profile.displayName,
        email,
        password: securedPassword,
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

    let user: { email: string; userId: number };

    if (!existingUser) {
      const securedPassword = generateHash('password123');
      const newUser = await this.userModel.create({
        name: `${profile.name.familyName} ${profile.name.middleName} ${profile.name.givenName}`,
        email,
        password: securedPassword,
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
        id: number;
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

      const user = await this.userModel.findOne({
        email: payload.email,
      });

      if (!user) throw new NotFoundException(USERS_MESSAGES.USER_NOT_FOUND);

      if (user.verify)
        throw new BadRequestException(USERS_MESSAGES.ACCOUNT_IS_VERIFIED);

      await this.userModel.updateOne(
        { email: payload.email },
        {
          $set: {
            verify: true,
            verifyEmailToken: null,
          },
        },
      );

      return {
        message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESSFULLY,
      };
    } catch (error) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }
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
        verifyEmailUrl,
      },
    });
  }

  private signAccessToken({
    userId,
    email,
    verifyStatus,
  }: {
    userId: number;
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
    userId: number;
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
    const existingUser = await this.userModel.findOne({
      email,
    });

    return Boolean(existingUser);
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await generateHash(refreshToken);

    await this.userModel.findByIdAndUpdate(
      userId,
      {
        refreshToken: hashedRefreshToken,
      },
      { new: true },
    );
  }

  async findUserByEmail(email: string): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email,
    });

    return existingUser;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({
      email,
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
    const user = await this.userModel.findOne(
      {
        email,
      },
      { password: 0 },
    );

    return user;
  }

  async logout(email: string) {
    await this.userModel.updateOne({ email }, { $set: { refreshToken: null } });

    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESSFUL,
    };
  }
}
