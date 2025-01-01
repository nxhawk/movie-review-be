import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TOKEN_MESSAGES, USERS_MESSAGES } from '../constants/message';
import { TokenInvalidException } from '../exceptions';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class AuthenticateMiddleware implements NestMiddleware {
  constructor(
    private readonly config: ConfigService,
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }

    const payload: {
      id: number;
      email: string;
      exp: number;
    } = this.jwtService.verify(token, {
      secret: this.config.getOrThrow<string>('auth.accessTokenSecret'),
      ignoreExpiration: true,
    });

    if (!payload) {
      throw new TokenInvalidException(TOKEN_MESSAGES.TOKEN_IS_INVALID);
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (payload.exp <= currentTimeInSeconds) {
      throw new UnauthorizedException(TOKEN_MESSAGES.TOKEN_IS_EXPIRED);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new BadRequestException(USERS_MESSAGES.USER_NOT_FOUND);
    }

    req.user = user;
    next();
  }
}
